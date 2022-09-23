from flask import Flask 
from flask import request 
import pandas as pd
from sklearn import preprocessing
import numpy as np

app = Flask(__name__)

path = r'C:\Users\joshuaji\OneDrive - Intel Corporation\Documents\Work\Github\Heatmap\cars.csv'

@app.route('/home', methods=['GET', 'POST'])
def home():  
    # if request.method == 'POST':
    data = pd.read_csv(path, encoding='utf-8')
    cols = data.select_dtypes(np.number).columns
    data[cols] = preprocessing.MinMaxScaler().fit_transform(data[cols])
    data = pd.DataFrame(data)
    print(request)
        # request.json['data']
    # return {"members": ["Member1", "Member2"]}
    return data.to_json(orient="records")  # default is columns

  
if __name__ =='__main__':  
    app.run(debug = True)  