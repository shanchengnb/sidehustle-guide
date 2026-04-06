"""
Vercel Serverless Function - 市场数据接口
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re

app = Flask(__name__)
CORS(app)


@app.route('/api/market/index', methods=['GET', 'OPTIONS'])
def market_index():
    """获取大盘指数"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        response = requests.get(
            "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001,0.399006,0.000300,0.000016",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"success": False, "error": "市场数据获取失败"}), 500

        data = response.json()
        result = []

        if data.get('data') and data['data'].get('diff'):
            for item in data['data']['diff']:
                result.append({
                    "code": item.get('f12', ''),
                    "name": item.get('f14', ''),
                    "price": item.get('f2', 0),
                    "change": item.get('f3', 0),
                    "changePercent": item.get('f4', 0),
                })

        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/market/hot', methods=['GET', 'OPTIONS'])
def market_hot():
    """获取热门板块"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        response = requests.get(
            "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"success": False, "error": "板块数据获取失败"}), 500

        data = response.json()
        result = []

        if data.get('data') and data['data'].get('diff'):
            for item in data['data']['diff']:
                result.append({
                    "name": item.get('f14', ''),
                    "change": item.get('f3', 0),
                })

        return jsonify({
            "success": True,
            "data": result[:10]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/news/finance', methods=['GET', 'OPTIONS'])
def finance_news():
    """获取财经新闻"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        response = requests.get(
            "https://newsapi.eastmoney.com/kuaixun/v1/getlist_102_ajaxResult_50_1_.html",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"success": False, "error": "新闻获取失败"}), 500

        data = response.json()
        result = []

        if data.get('batchList'):
            for item in data['batchList'][:15]:
                result.append({
                    "title": item.get('title', ''),
                    "url": item.get('url', ''),
                    "time": item.get('showTime', ''),
                })

        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


handler = app
