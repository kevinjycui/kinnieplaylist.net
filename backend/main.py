from flask import Flask, request, redirect, Response
from flask_cors import CORS

import yaml
import json

from data import Database, NotFoundError
from spotify import SpotifyManager

from apscheduler.schedulers.background import BackgroundScheduler

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

name = config['app']
client_url = config['client']

app = Flask(__name__)
CORS(app)

database = Database()
spotifyManager = SpotifyManager()

def prune_user_id_cache():
    spotifyManager.prune_user_id_cache()

sched = BackgroundScheduler()
sched.add_job(prune_user_id_cache, 'interval', hours=1)
sched.start()

@app.route("/auth/login", methods=["GET"])
def login_spotify():
    return redirect(spotifyManager.generate_auth_code())

@app.route("/auth/refresh", methods=["GET"])
def refresh_spotify():
    refresh_token = request.args.get('refresh_token')
    try:
        token, expires_in = spotifyManager.refresh_access_token(refresh_token)
        return json.dumps({
            'access_token': token,
            'expires_in': expires_in
        })
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/auth/callback", methods=["GET"])
def callback_spotify():
    code = request.args.get('code')
    token, refresh_token, expires_in = spotifyManager.generate_access_token(code)
    return redirect(client_url + '?access_token=' + token + '&refresh_token=' + refresh_token + '&expires_in=' + str(expires_in))

@app.route("/api/ping", methods=["GET"])
def ping():
    return json.dumps({'message': 'pong'})

@app.route("/api/characters", methods=["GET"])
def get_characters():
    try:
        return database.get_characters().to_json()
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/medias", methods=["GET"])
def get_character_medias():
    try:
        return database.get_medias().to_json()
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/character/<character_id>", methods=["GET"])
def get_character(character_id):
    try:
        return database.get_character(character_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/random", methods=["GET"])
def get_random_character():
    try:
        return database.get_random_character().to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/top", methods=["GET"])
def get_my_top_characters():
    try:
        token = request.args.get('access_token')
        user_data = spotifyManager.get_user_data(token)
        return database.get_top_characters_voted_by(user_data['id']).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/voted", methods=["GET"])
def get_voted_characters():
    try:
        token = request.args.get('access_token')
        user_data = spotifyManager.get_user_data(token)
        return database.get_all_characters_voted_by(user_data['id']).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/unvoted", methods=["GET"])
def get_unvoted_characters():
    try:
        token = request.args.get('access_token')
        user_data = spotifyManager.get_user_data(token)
        return database.get_all_characters_not_voted_by(user_data['id']).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/song/<song_id>", methods=["GET"])
def get_song(song_id):
    try:
        return database.get_song(song_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/playlist/global/<character_id>", methods=["GET"])
def get_character_global_playlist(character_id):
    try:
        return database.get_character_songs(character_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/characters/similar/<character_id>", methods=["GET"])
def get_similar_characters(character_id):
    try:
        return database.get_similar_characters(character_id).to_json()
    except NotFoundError as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=404)
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/playlist/mine/<character_id>", methods=["GET", "POST", "DELETE"])
def character_my_playlist(character_id):
    if request.method == "POST":
        try:
            token = request.args.get('access_token')
            body = request.get_json()
            song_id = body['song_id']
            user_data = spotifyManager.get_user_data(token)
            song_data = database.get_song(song_id)
            if song_data is None:
                song_data = spotifyManager.get_song(token, song_id)
                database.post_song(song_id, song_data)
            
            success = database.post_character_song(character_id, song_id, user_data['id'])

            return json.dumps({
                'duplicate': not success,
                'song_id': song_id
            })
        except Exception as e:
            return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

    elif request.method == "DELETE":
        try:
            token = request.args.get('access_token')
            body = request.get_json()
            song_id = body['song_id']
            user_data = spotifyManager.get_user_data(token)
            song_data = database.get_song(song_id)
            if song_data is None:
                song_data = spotifyManager.get_song(token, song_id)
                database.post_song(song_id, song_data)
            
            success = database.delete_character_song(character_id, song_id, user_data['id'])

            return json.dumps({
                'existed': success,
                'song_id': song_id
            })
        except Exception as e:
            return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

    elif request.method == "GET":
        try:
            token = request.args.get('access_token')
            user_data = spotifyManager.get_user_data(token)
            return database.get_character_songs(character_id, user_data['id']).to_json()
        except NotFoundError as e:
            return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=404)
        except Exception as e:
            return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

@app.route("/api/votes/latest", methods=["GET"])
def get_latest_votes():
    try:
        return database.get_latest_votes().to_json()
    except Exception as e:
        return Response(json.dumps({'message': type(e).__name__ + ': ' + str(e)}), status=500)

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
    