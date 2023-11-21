from flask import Flask, request, redirect, Response
from flask_cors import CORS

import yaml
import json

from data import Database, NotFoundError
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

@app.route("/auth/refresh", methods=["GET"])
def refresh_spotify():
    refresh_token = request.args.get('refresh_token')
    try:
        token = spotifyManager.refresh_access_token(refresh_token)
        return json.dumps({
            'access_token': token
        })
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/auth/callback", methods=["GET"])
def callback_spotify():
    code = request.args.get('code')
    token, refresh_token = spotifyManager.generate_access_token(code)
    return redirect(client_url + '?access_token=' + token + '&refresh_token=' + refresh_token)

@app.route("/api/ping", methods=["GET"])
def ping():
    return json.dumps({'message': 'pong'})

@app.route("/api/characters", methods=["GET"])
def get_characters():
    try:
        return database.get_characters().to_json()
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/<character_id>", methods=["GET"])
def get_character(character_id):
    try:
        return database.get_character(character_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/playlist/global/<character_id>", methods=["GET"])
def get_character_global_playlist(character_id):
    try:
        return database.get_character_songs(character_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/playlist/mine/<character_id>", methods=["GET", "POST"])
def character_my_playlist(character_id):
    body = request.get_json()
    token = body['access_token']
    if request.method == "POST":
        try:
            song_id = body['song_id']
            user_data = spotifyManager.get_user_data(token)
            song_data = database.get_song(song_id)
            if song_data is None:
                song_data = spotifyManager.get_song(token, song_id)
                database.post_song(song_id, song_data)
            
            duplicate = database.post_character_song(character_id, song_id, user_data['id'])

            return json.dumps({
                'duplicate': not duplicate,
                'song': song_data.to_json()
            })
        except Exception as e:
            return Response(json.dumps({'message': str(e)}), status=500)

    elif request.method == "GET":
        user_data = spotifyManager.get_user_data(token)
        try:
            return database.get_character_songs(character_id, user_data.id).to_json()
        except NotFoundError as e:
            return Response(json.dumps({'message': str(e)}), status=404)
        except Exception as e:
            return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    