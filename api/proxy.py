"""
Vercel Serverless Function - 数据源代理
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


@app.route('/api/reddit/<subreddit>', methods=['GET', 'OPTIONS'])
def reddit_proxy(subreddit):
    """Reddit代理"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    sort = request.args.get('sort', 'hot')
    limit = request.args.get('limit', '25')

    try:
        response = requests.get(
            f"https://www.reddit.com/r/{subreddit}/{sort}.json?limit={limit}",
            headers={"User-Agent": "AI-Daily-News/1.0"},
            timeout=30
        )

        if not response.ok:
            return jsonify({"error": f"Reddit API error: {response.status_code}"}), 500

        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/hn/search', methods=['GET', 'OPTIONS'])
def hn_proxy():
    """HackerNews Algolia代理"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    query = request.args.get('query', 'AI')
    hitsPerPage = request.args.get('hitsPerPage', '30')

    try:
        response = requests.get(
            f"https://hn.algolia.com/api/v1/search?query={query}&tags=story&hitsPerPage={hitsPerPage}",
            headers={"User-Agent": "AI-Daily-News/1.0"},
            timeout=30
        )

        if not response.ok:
            return jsonify({"error": f"HN API error: {response.status_code}"}), 500

        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/producthunt', methods=['GET', 'OPTIONS'])
def producthunt_proxy():
    """Product Hunt RSS代理"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        response = requests.get(
            "https://www.producthunt.com/feed",
            headers={
                "User-Agent": "AI-Daily-News/1.0",
                "Accept": "application/rss+xml"
            },
            timeout=30
        )

        if not response.ok:
            return jsonify({"error": f"Product Hunt error: {response.status_code}"}), 500

        return response.text, 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/ecommerce/news', methods=['GET', 'OPTIONS'])
def ecommerce_news():
    """获取跨境电商资讯"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    # 返回模拟数据（实际可接入真实API）
    return jsonify({
        "success": True,
        "data": [
            {"title": "Temu美国日下载量首超Amazon", "summary": "Temu在美国市场增长迅猛，日下载量首次超越亚马逊", "url": "#", "time": ""},
            {"title": "TikTok Shop东南亚GMV破百亿", "summary": "TikTok电商业务在东南亚快速扩张", "url": "#", "time": ""},
            {"title": "亚马逊下调FBA配送费", "summary": "为应对竞争，亚马逊调整物流费用政策", "url": "#", "time": ""},
            {"title": "SHEIN推出半托管模式", "summary": "SHEIN开放商家自主运营权限", "url": "#", "time": ""},
            {"title": "跨境电商合规化趋势加强", "summary": "各国监管政策趋严，合规经营成关键", "url": "#", "time": ""},
        ]
    })


handler = app
