"""
Vercel Serverless Function - 万晴API生成接口
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re

app = Flask(__name__)
CORS(app)

WQ_API_KEY = os.environ.get("WQ_API_KEY", "e6thjxhllw5rn8sikp36nj4xng7xxtbwaj29")
WQ_API_ENDPOINT = os.environ.get("WQ_API_ENDPOINT", "https://wanqing-api.corp.kuaishou.com/api/gateway/v1/endpoints/chat/completions")
WQ_MODEL = os.environ.get("WQ_MODEL", "ep-qlw5q3-1773648874535023359")


@app.route('/api/generate', methods=['POST', 'OPTIONS'])
def generate():
    """通用生成API"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        data = request.json or {}
        api_key = data.get('apiKey', WQ_API_KEY)
        model = data.get('model', WQ_MODEL)
        system_prompt = data.get('systemPrompt', '你是AI助手')
        user_input = data.get('userInput', '')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            "temperature": 0.7,
            "max_tokens": 4096
        }

        response = requests.post(WQ_API_ENDPOINT, headers=headers, json=payload, timeout=120)

        if not response.ok:
            return jsonify({
                "success": False,
                "error": f"API请求失败: {response.status_code}",
                "detail": response.text
            }), 500

        result = response.json()

        if "choices" not in result or len(result["choices"]) == 0:
            return jsonify({
                "success": False,
                "error": "API返回格式异常",
                "detail": str(result)
            }), 500

        content = result["choices"][0]["message"].get("content", "")

        # 清理可能的markdown代码块
        cleaned = re.sub(r'```json\s*', '', content)
        cleaned = re.sub(r'```\s*', '', cleaned)
        cleaned = cleaned.strip()

        return jsonify({
            "success": True,
            "content": cleaned,
            "raw": content
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    """多轮对话API"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        data = request.json or {}
        messages = data.get('messages', [])
        api_key = data.get('apiKey', WQ_API_KEY)
        model = data.get('model', WQ_MODEL)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        payload = {
            "model": model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 4096
        }

        response = requests.post(WQ_API_ENDPOINT, headers=headers, json=payload, timeout=120)

        if not response.ok:
            return jsonify({
                "success": False,
                "error": f"API请求失败: {response.status_code}",
                "detail": response.text
            }), 500

        result = response.json()
        content = result["choices"][0]["message"].get("content", "")

        return jsonify({
            "success": True,
            "content": content,
            "full_response": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# Vercel 需要这个
handler = app
