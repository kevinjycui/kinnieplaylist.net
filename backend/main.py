from flask import Flask, request, redirect, Response
from flask_cors import CORS

import yaml
import json

from data import Database
from spotify import SpotifyManager

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

name = config['app']
client_url = config['client']

app = Flask(__name__)
CORS(app)

database = Database()
spotifyManager = SpotifyManager()

@app.route("/auth/login", methods=["GET"])
def login_spotify():
    return redirect(spotifyManager.generate_auth_code())

@app.route("/auth/callback", methods=["GET"])
def callback_spotify():
    code = request.args.get('code')
    token = spotifyManager.generate_access_token(code)
    return redirect(client_url + '?access_token=' + token)

@app.route("/api/ping", methods=["GET"])
def ping():
    return "Pong"

@app.route("/api/characters", methods=["GET"])
def get_all_characters():
    return database.get_characters().to_json()

@app.route("/api/characters/<path>", methods=["GET"])
def get_character(path):
    try:
        return database.get_character_by_path(path).to_json()
    except Exception as e:
        return Response(json.dumps({'message': str(e)}), status=404)

@app.route("/api/playlist/global/<character_id>", methods=["GET"])
def get_character_global_playlist(character_id):
    try:
        return database.get_character_songs(character_id).to_json()
    except Exception as e:
        return Response(json.dumps({'message': str(e)}), status=404)

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
