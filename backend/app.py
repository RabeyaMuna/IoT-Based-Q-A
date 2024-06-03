from flask import Flask, request, jsonify
from rag_model import create_rag_pipeline
import numpy as np
from flask_cors import CORS
import os
import sys

sys.path.append('./models')

app = Flask(__name__)

CORS(app)

@app.route('/', methods=['POST'])
def query():
    rag_chain = create_rag_pipeline()

    try:

        query_text = request.json['query']
        
        response = rag_chain.invoke(query_text)
    
        return jsonify({'query': query_text, 'response': response})
    
    except Exception as e: 
        return jsonify({'error': str(e)})
    
@app.route('/status', methods=['GET'])
def status():
  return 'Cehck status'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)