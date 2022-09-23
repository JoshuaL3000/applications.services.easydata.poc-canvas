import React, { useState, useRef, Component, useEffect, useCallback  } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Handle,
  useZoomPanHelper,
} from 'react-flow-renderer';

import { Menu, Item, Separator, Submenu, MenuProvider, useContextMenu } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

import Sidebar from './Layout/Sidebar'
import './PocApp.css'

const initialElements = [
  {
    id: `randomnode_${+new Date()}`,
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
];

const getNodeId = () => `randomnode_${+new Date()}`;

const PocApp = () => {
  
  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const [elements, setElements] = useState(initialElements);
  
  const onConnect = (params) => {
    params = {
      ...params,
      arrowHeadType: 'arrowclosed',
    }
    setElements((els) => addEdge(params, els))
  };
  
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log(flow)
    }
  }, [reactFlowInstance]);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const [nodeValue, setNodeValue] = useState(null)

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getNodeId(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setElements((es) => es.concat(newNode));
  };

  const CircleNode = (event) => {

    const [circleBoxValue, setCircleBoxValue] = useState(event.data.label)
    const MENU_ID = event.id;
    const { show } = useContextMenu({
      id: MENU_ID
    });
    const displayMenu = (event) => {
      show(event, {
        position:{
          x: 50,
          y: 50,
        }
      });
    }
    useEffect(() => {
      setElements((els) =>
        els.map((el) => {
          if (el.id === event.id) {
            el.data = {
              ...el.data,
              label: circleBoxValue,
            };
          }
  
          return el;
        })
      );
    }, [circleBoxValue, setElements]);

    const handleItemClick = ({ data }) => {
      setCircleBoxValue(data.name)
    }
  
    return (
      <>
          <div className="circle" onContextMenu={displayMenu}>
            <Handle type="target" position="top" style={{ borderRadius: 0 }} />
            <div>{event.data.label}</div>
            <Handle
              type="source"
              position="bottom"
              id="a"
              style={{ top: '95%', borderRadius: 0 }}
            />
          </div>
          <Menu id={MENU_ID}>
            <Item onClick={handleItemClick} data={{name: 'abc'}}>abc</Item>
            <Item onClick={handleItemClick} data={{name: '123'}}>123</Item>
            <Separator />
            <Item disabled>Disabled</Item>
            <Separator />
            <Submenu label="Submenu">
              <Item onClick={handleItemClick}>Sub Option 1</Item>
              <Item onClick={handleItemClick}>Sub Option 2</Item>
            </Submenu>
          </Menu>
      </>
    );
  };

  const nodeTypes = {
    circle: CircleNode,
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        
          <ReactFlow
            elements={elements}
            onConnect={onConnect}
            onElementsRemove={onElementsRemove}
            onLoad={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
          
        </div>
        <Sidebar />
        
        <div className="save__controls">
            <button onClick={onSave}>save</button>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default PocApp;