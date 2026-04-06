"""
Vercel Serverless Function - 健康检查
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health():
    """健康检查"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
    return jsonify({"status": "ok", "service": "sidehustle-guide"})


handler = app
