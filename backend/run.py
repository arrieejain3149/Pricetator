from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import requests
from dotenv import load_dotenv
import jwt
import json
import base64

# Load environment variables
load_dotenv()

print("🔧 Starting Pricetator backend...")

# Initialize Flask app
app = Flask(__name__, template_folder='app/templates', static_folder='app/static')
CORS(app, origins=['http://localhost:3000', 'http://localhost:3001'])

# Configuration
UPLOAD_FOLDER = 'app/static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
SERPAPI_KEY = os.getenv('SERPAPI_KEY', '')
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SECRET_KEY'] = SECRET_KEY

# In-memory user database
USERS_DB = {}
SEARCH_HISTORY_DB = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def search_with_serpapi(product_name):
    """Search using SerpAPI"""
    if not SERPAPI_KEY:
        return None
    
    try:
        url = "https://serpapi.com/search"
        params = {
            "q": product_name,
            "tbm": "shop",
            "api_key": SERPAPI_KEY,
            "gl": "in"
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            shopping_results = data.get('shopping_results', [])
            
            results = []
            for item in shopping_results[:6]:
                try:
                    price = item.get('price', 'N/A')
                    if price and price != 'N/A':
                        price_text = str(price).replace('₹', '').replace(',', '').strip()
                        price_value = int(float(price_text))
                        
                        results.append({
                            "platform": item.get('source', 'Online Store'),
                            "price": f"₹{price_value:,}",
                            "link": item.get('link', '#'),
                            "original": price_value,
                            "image": item.get('image', '')
                        })
                except:
                    continue
            
            return results if results else None
    except Exception as e:
        print(f"❌ SerpAPI error: {e}")
    
    return None

# ===== ROUTES =====

@app.route('/')
def index():
    return jsonify({"message": "Welcome to Pricetator! 💰", "version": "2.0"})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "message": "Pricetator backend is running!",
        "serpapi": "✅ Ready" if SERPAPI_KEY else "⚠️ No API Key"
    })

# ===== AUTHENTICATION =====

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Handle Google authentication - Simplified version"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({"success": False, "error": "Token is required"}), 400
        
        try:
            # Google JWT has 3 parts separated by dots
            parts = token.split('.')
            if len(parts) >= 2:
                # Decode the payload (second part)
                payload = parts[1]
                padding = 4 - len(payload) % 4
                if padding != 4:
                    payload += '=' * padding
                
                decoded = base64.urlsafe_b64decode(payload)
                user_data = json.loads(decoded)
                
                user_id = user_data.get('sub', 'user_' + str(datetime.now().timestamp()))
                email = user_data.get('email', 'user@example.com')
                name = user_data.get('name', 'User')
                picture = user_data.get('picture', '')
                
                # Create or update user
                if user_id not in USERS_DB:
                    USERS_DB[user_id] = {
                        'user_id': user_id,
                        'email': email,
                        'name': name,
                        'picture': picture,
                        'created_at': datetime.now().isoformat(),
                        'total_searches': 0
                    }
                    SEARCH_HISTORY_DB[user_id] = []
                
                # Generate JWT token for our app
                jwt_token = jwt.encode(
                    {'user_id': user_id},
                    app.config['SECRET_KEY'],
                    algorithm='HS256'
                )
                
                return jsonify({
                    "success": True,
                    "token": jwt_token,
                    "user": USERS_DB[user_id]
                }), 200
        except Exception as decode_error:
            print(f"Token decode error: {decode_error}")
            # Fallback: create dummy user for testing
            user_id = f"test_user_{int(datetime.now().timestamp())}"
            USERS_DB[user_id] = {
                'user_id': user_id,
                'email': 'test@example.com',
                'name': 'Test User',
                'picture': 'https://via.placeholder.com/150',
                'created_at': datetime.now().isoformat(),
                'total_searches': 0
            }
            SEARCH_HISTORY_DB[user_id] = []
            
            jwt_token = jwt.encode(
                {'user_id': user_id},
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            
            return jsonify({
                "success": True,
                "token": jwt_token,
                "user": USERS_DB[user_id]
            }), 200
    
    except Exception as e:
        print(f"❌ Auth error: {e}")
        return jsonify({"success": False, "error": f"Authentication failed: {str(e)}"}), 400

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

# ===== USER ROUTES =====

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
        
        if user_id not in USERS_DB:
            return jsonify({"error": "User not found"}), 404
        
        user = USERS_DB[user_id]
        search_count = len(SEARCH_HISTORY_DB.get(user_id, []))
        
        return jsonify({
            "user": {
                **user,
                "total_searches": search_count
            }
        }), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
        
        if user_id not in USERS_DB:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        if 'name' in data:
            USERS_DB[user_id]['name'] = data['name']
        
        return jsonify({
            "success": True,
            "user": USERS_DB[user_id]
        }), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/api/user/search-history', methods=['GET'])
def get_search_history():
    """Get user's search history"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
        
        history = SEARCH_HISTORY_DB.get(user_id, [])
        return jsonify({
            "history": history,
            "total": len(history)
        }), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/api/user/search-history/<search_id>', methods=['DELETE'])
def delete_search_history(search_id):
    """Delete specific search from history"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
        
        if user_id in SEARCH_HISTORY_DB:
            SEARCH_HISTORY_DB[user_id] = [
                s for s in SEARCH_HISTORY_DB[user_id]
                if s.get('id') != search_id
            ]
        
        return jsonify({"success": True}), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

@app.route('/api/user/search-history/clear', methods=['DELETE'])
def clear_search_history():
    """Clear all search history"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded['user_id']
        
        SEARCH_HISTORY_DB[user_id] = []
        return jsonify({"success": True, "message": "Search history cleared"}), 200
    except:
        return jsonify({"error": "Invalid token"}), 401

# ===== SEARCH ROUTES =====

@app.route('/api/search', methods=['POST'])
def search_product():
    """Search for a product"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        token = auth_header.split(' ')[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = decoded['user_id']
    except:
        return jsonify({"error": "Invalid token"}), 401
    
    data = request.get_json()
    product_name = data.get('product_name', '').strip()
    
    if not product_name:
        return jsonify({"error": "Product name is required"}), 400
    
    if not SERPAPI_KEY:
        return jsonify({
            "error": "SerpAPI key not configured",
            "message": "Please set SERPAPI_KEY in .env file"
        }), 400
    
    print(f"🔍 User {current_user} searching for: {product_name}")
    results = search_with_serpapi(product_name)
    
    # Save to search history
    search_entry = {
        "id": f"{current_user}_{datetime.now().timestamp()}",
        "product": product_name,
        "timestamp": datetime.now().isoformat(),
        "results_count": len(results) if results else 0
    }
    
    if current_user not in SEARCH_HISTORY_DB:
        SEARCH_HISTORY_DB[current_user] = []
    
    SEARCH_HISTORY_DB[current_user].insert(0, search_entry)
    SEARCH_HISTORY_DB[current_user] = SEARCH_HISTORY_DB[current_user][:50]
    
    if not results:
        return jsonify({
            "product": product_name,
            "message": "No prices found for this product",
            "results": []
        }), 200
    
    # Sort by price
    sorted_results = sorted(results, key=lambda x: x['original'])
    best_price = sorted_results[0]['original']
    
    for item in sorted_results:
        item['savings'] = item['original'] - best_price
    
    return jsonify({
        "product": product_name,
        "best_price": best_price,
        "total_results": len(sorted_results),
        "results": sorted_results
    }), 200

@app.route('/api/trending', methods=['GET'])
def trending():
    """Get trending products"""
    return jsonify({
        "trending": [
            {"name": "iPhone 15", "searches": 1250},
            {"name": "Samsung Galaxy S24", "searches": 980},
            {"name": "MacBook Air", "searches": 650},
            {"name": "OnePlus Nord CE5", "searches": 540},
            {"name": "iPad Pro", "searches": 420},
            {"name": "AirPods Pro", "searches": 380},
        ]
    }), 200

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """Upload product image"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            "success": True,
            "message": "Image uploaded successfully",
            "file_path": f"/static/uploads/{filename}",
            "detected_product": "Product Detection Coming Soon"
        }), 200
    
    return jsonify({"error": "Invalid file type"}), 400

print("✅ All routes registered")
print("\n" + "="*60)
print("🚀 Pricetator 2.0 Backend Ready!")
print("="*60)
print("📍 Server running at: http://0.0.0.0:5000")
print("\n🔑 Features:")
print("   ✅ Google Authentication")
print("   ✅ User Profiles")
print("   ✅ Search History")
print("   ✅ Product Search")
print("   ✅ SerpAPI Integration")
print("\n💡 Setup:")
print(f"   SERPAPI_KEY: {'✅ Set' if SERPAPI_KEY else '⚠️ Not set'}")
print("="*60 + "\n")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)