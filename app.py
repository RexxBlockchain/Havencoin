# app.py
from flask import Flask, request, jsonify, render_template, send_file
from pymongo import MongoClient
import requests
import config
import io

app = Flask(__name__)
app.config.from_object(config.Config)

# MongoDB setup
client = MongoClient(app.config['MONGODB_URI'])
db = client['havencoin']
users_collection = db['users']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/complete_task', methods=['POST'])
def complete_task():
    data = request.json
    user_id = data['user_id']
    task = data['task']

    user = users_collection.find_one({'user_id': user_id})

    if user:
        tasks = user.get('tasks', [])
        if task in tasks:
            return jsonify({'success': False, 'message': 'Task already completed'})
        else:
            tasks.append(task)
            balance = user.get('balance', 0) + 1000
            users_collection.update_one({'user_id': user_id}, {'$set': {'tasks': tasks, 'balance': balance}})
            return jsonify({'success': True})
    else:
        users_collection.insert_one({'user_id': user_id, 'tasks': [task], 'balance': 1000})
        return jsonify({'success': True})

@app.route('/get_profile_picture', methods=['GET'])
def get_profile_picture():
    user_id = request.args.get('user_id')
    photos = get_user_profile_photos(user_id)

    if photos and 'result' in photos and photos['result']['photos']:
        file_id = photos['result']['photos'][0][0]['file_id']
        file_info = get_file(file_id)

        if file_info and 'result' in file_info and 'file_path' in file_info['result']:
            file_path = file_info['result']['file_path']
            proxy_url = f'/proxy?file_path={file_path}'
            return jsonify({'photo_url': proxy_url})

    return jsonify({'photo_url': None})

def get_user_profile_photos(user_id):
    url = f"https://api.telegram.org/bot{app.config['TELEGRAM_BOT_TOKEN']}/getUserProfilePhotos?user_id={user_id}&limit=1"
    response = requests.get(url)
    return response.json()

def get_file(file_id):
    url = f"https://api.telegram.org/bot{app.config['TELEGRAM_BOT_TOKEN']}/getFile?file_id={file_id}"
    response = requests.get(url)
    return response.json()

@app.route('/proxy', methods=['GET'])
def proxy():
    file_path = request.args.get('file_path')
    file_url = f"https://api.telegram.org/file/bot{app.config['TELEGRAM_BOT_TOKEN']}/{file_path}"
    response = requests.get(file_url)

    if response.status_code == 200:
        return send_file(io.BytesIO(response.content), mimetype=response.headers['Content-Type'])
    else:
        return "Error fetching file", 500

if __name__ == '__main__':
    app.run(debug=True)
