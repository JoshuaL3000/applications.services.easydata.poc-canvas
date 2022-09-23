import React, { useState, useRef, Component, useEffect, useCallback  } from 'react';
import './App.css';
import Plot from 'react-plotly.js';


function App() {

  // declare state variable
  const [csvdata, setData] = useState([{}]) 
  const [z, setZ] = useState([])
  const [x, setX] = useState([])
  const [xaxis, setXaxis] = useState()
  const [y, setY] = useState([])
  
  useEffect(() =>{

    // fetch from /<> router
    fetch("/home", {
      method: "POST",
      headers: {
          "Content-type": "application/json",
      },
      // body: JSON.stringify({"data": csvdata})
    
    }).then(

    // fetch("/home").then(
      res => res.json()
    ).then(
      csvdata => {
        setData(csvdata)

        // display the data in console
        // console.log(Array.isArray(csvdata))
        // console.log(csvdata)
        // console.log(csvdata[0].Acceleration)    // to access a value of column

        // x-axis
        const x = []
        for(let i in csvdata[0]){   //Skip first column (string/label)
          x.push(i)
        }        

        // y-axis
        const y = []
        for(let i = 0; i < csvdata.length; i++){  
          y.push(csvdata[i][x[0]])
        }

        setXaxis(x[0])
        x.shift(1)
        // alert(x)

        const z = []
        for(let i = 0; i < csvdata.length; i++){
          const zin = []
          for(let j = 0; j < x.length; j++){      //no need to skip first column since already x.shift(1)
            zin.push(csvdata[i][x[j]])
          }
          z.push(zin)
        }

        setZ(z)
        setX(x)
        setY(y)
        
        // console.log(y)
        // console.log(x) 
        // console.log(z)
      }
    )
  }, [])

  return (
    // <div>
    //   <p>{data[0].Car}</p>
    // </div>
    <Plot
        data={[
          {
            z: z,
            x: x,
            y: y,
            type: 'heatmap',
            showscale: true,
            colorscale: "Hot",
            // mode: 'lines+markers',
            // marker: {color: 'red'},
          },
        ]}
        layout={ {
        width: 1000, 
        height: 700, 
        title: 'Heatmap',
        
        xaxis: {
          title: {
            text: 'x Axis',
            font: {
              family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          ticklabelposition: "inside",
          // automargin: "false",
          title: {
            text: xaxis,
            size: 30,
            // anchor: 'free',
            // position: 0,
            standoff: 1,
            font: {
              family: 'Courier New, monospace',
              size: 30,
              color: '#000000',
            }
          },
          tickfont:{
            size: 10,
          },
        }} }
        
      />
  );
}

export default App;