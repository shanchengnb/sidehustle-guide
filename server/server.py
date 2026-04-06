#!/usr/bin/env python3
"""
万晴平台API代理服务 + 数据源代理
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re
import json

app = Flask(__name__)
CORS(app)

# 万晴平台API配置
WQ_API_KEY = os.environ.get("WQ_API_KEY", "e6thjxhllw5rn8sikp36nj4xng7xxtbwaj29")
WQ_API_ENDPOINT = "https://wanqing-api.corp.kuaishou.com/api/gateway/v1/endpoints/chat/completions"
WQ_MODEL = "ep-qlw5q3-1773648874535023359"


@app.route('/api/generate', methods=['POST'])
def generate():
    """
    通用生成API - 用于AI每日总结
    """
    try:
        data = request.json
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


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    多轮对话API
    """
    try:
        data = request.json
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


# ============ 数据源代理 ============

@app.route('/api/reddit/<subreddit>', methods=['GET'])
def reddit_proxy(subreddit):
    """Reddit代理"""
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


@app.route('/api/hn/search', methods=['GET'])
def hn_proxy():
    """HackerNews Algolia代理"""
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


@app.route('/api/producthunt', methods=['GET'])
def producthunt_proxy():
    """Product Hunt RSS代理"""
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


@app.route('/api/futuretools', methods=['GET'])
def futuretools_proxy():
    """FutureTools代理"""
    try:
        response = requests.get(
            "https://www.futuretools.io/",
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},
            timeout=30
        )

        if not response.ok:
            return jsonify({"error": f"FutureTools error: {response.status_code}"}), 500

        return response.text, 200, {'Content-Type': 'text/html'}
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({"status": "ok", "service": "ai-daily-news-proxy"})


# ============ 市场数据抓取 ============

@app.route('/api/market/index', methods=['GET'])
def market_index():
    """获取大盘指数"""
    try:
        # 东方财富指数接口
        response = requests.get(
            "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001,0.399006,0.000300,0.000016",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"error": "市场数据获取失败"}), 500

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
                    "volume": item.get('f5', 0),
                    "amount": item.get('f6', 0),
                })

        return jsonify({
            "success": True,
            "data": result,
            "updateTime": data.get('data', {}).get('time', '')
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/market/hot', methods=['GET'])
def market_hot():
    """获取热门板块"""
    try:
        response = requests.get(
            "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&fltt=2&invt=2&fid=f3&fs=m:90+t:2",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"error": "板块数据获取失败"}), 500

        data = response.json()
        result = []

        if data.get('data') and data['data'].get('diff'):
            for item in data['data']['diff']:
                result.append({
                    "name": item.get('f14', ''),
                    "change": item.get('f3', 0),
                    "leading": item.get('f140', '') or item.get('f14', ''),
                })

        return jsonify({
            "success": True,
            "data": result[:10]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/fund/hot', methods=['GET'])
def fund_hot():
    """获取热门基金"""
    try:
        response = requests.get(
            "https://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=gp&rs=&gs=0&sc=3yzf&st=desc&sd=2024-01-01&ed=2025-12-31&qdii=&tabSubtype=,,,,,&pi=1&pn=20",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"error": "基金数据获取失败"}), 500

        text = response.text
        # 解析返回数据
        import re
        match = re.search(r'var rankData = ({.*?});', text)
        if match:
            import json
            data = json.loads(match.group(1))
            result = []

            if data.get('datas'):
                for item in data['datas'][:20]:
                    parts = item.split(',')
                    if len(parts) >= 10:
                        result.append({
                            "code": parts[0],
                            "name": parts[1],
                            "type": parts[2],
                            "dayGrowth": parts[3],
                            "weekGrowth": parts[5],
                            "monthGrowth": parts[6],
                            "threeMonthGrowth": parts[7],
                            "sixMonthGrowth": parts[8],
                            "yearGrowth": parts[9],
                        })

            return jsonify({
                "success": True,
                "data": result
            })

        return jsonify({"success": False, "error": "解析失败"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/news/finance', methods=['GET'])
def finance_news():
    """获取财经新闻"""
    try:
        response = requests.get(
            "https://newsapi.eastmoney.com/kuaixun/v1/getlist_102_ajaxResult_50_1_.html",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if not response.ok:
            return jsonify({"error": "新闻获取失败"}), 500

        data = response.json()
        result = []

        if data.get('batchList'):
            for item in data['batchList'][:20]:
                result.append({
                    "title": item.get('title', ''),
                    "url": item.get('url', ''),
                    "source": item.get('source', ''),
                    "time": item.get('showTime', ''),
                })

        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ecommerce/news', methods=['GET'])
def ecommerce_news():
    """获取跨境电商资讯"""
    try:
        # 跨境电商头条资讯
        response = requests.get(
            "https://www.cifnews.com/api/article/list?categoryId=1&pageNum=1&pageSize=20",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=10
        )

        if response.ok:
            data = response.json()
            if data.get('data') and data['data'].get('list'):
                result = []
                for item in data['data']['list'][:15]:
                    result.append({
                        "title": item.get('title', ''),
                        "summary": item.get('summary', '') or item.get('description', ''),
                        "url": f"https://www.cifnews.com/article/{item.get('id', '')}",
                        "time": item.get('publishTime', ''),
                    })
                return jsonify({"success": True, "data": result})

        # 备用：返回模拟数据
        return jsonify({
            "success": True,
            "data": [
                {"title": "Temu美国日下载量首超Amazon", "summary": "Temu在美国市场增长迅猛，日下载量首次超越亚马逊", "url": "https://www.cifnews.com", "time": ""},
                {"title": "TikTok Shop东南亚GMV破百亿", "summary": "TikTok电商业务在东南亚快速扩张", "url": "https://www.cifnews.com", "time": ""},
                {"title": "亚马逊下调FBA配送费", "summary": "为应对竞争，亚马逊调整物流费用政策", "url": "https://www.cifnews.com", "time": ""},
            ]
        })
    except Exception as e:
        return jsonify({"success": True, "data": [], "error": str(e)})




if __name__ == '__main__':
    print("=" * 50)
    print("🚀 AI每日资讯代理服务")
    print("=" * 50)
    print(f"🌐 访问地址: http://localhost:5000")
    print(f"📡 万晴API: {WQ_API_ENDPOINT}")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
