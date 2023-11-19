import yaml
import requests
import json
import time
import random
import string

from flask import redirect

from song import Song


def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join([random.choice(letters) for i in range(length)])

def params_to_string(params):
    return '&'.join(list(map(lambda param : param[0] + '=' + param[1], params.items())))

class SpotifyManager:
    def __init__(self):
        with open('config.yml', 'r') as file:
            config = yaml.safe_load(file)

        self.server_url = config['server']
        self.url = config['spotify']['url']

        self.client_id = config['spotify']['client_id']
        self.client_secret = config['spotify']['client_secret']

        self.refresh_tokens = {}

    def server_at(self, path):
        return self.server_url + path

    def generate_auth_code(self):
        scope = 'streaming \
                user-read-email user-read-private user-library-read playlist-read-private'
        state = generate_random_string(16)

        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'scope': scope,
            'redirect_uri': self.server_at('auth/callback'),
            'state': state
        }

        return self.url + 'authorize?' + params_to_string(params)

    def generate_access_token(self, code):
        data = {
            'code': code,
            'redirect_uri': self.server_at('auth/callback'),
            'grant_type': 'authorization_code'
        }
        auth = (self.client_id, self.client_secret)
        headers = {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }

        res = requests.post(self.url + 'api/token', data=data, auth=auth, headers=headers)
        res.raise_for_status()

        res = res.json()

        token = res['access_token']

        user_data = self.get_user_data(token)

        self.refresh_tokens[user_data['id']] = res['refresh_token']

        return token

    def get_user_data(self, token):
        data = {
            'grant_type': 'access_token'
        }
        headers = {
            'Authorization': 'Bearer ' + token
        }

        res = requests.get(self.url + 'v1/me', data=data, headers=headers)
        res.raise_for_status()

        res = res.json()

        return {
            'name': res['display_name'],
            'id': res['id']
        }

    def get_song(self, token, song_id):
        data = {
            'grant_type': 'access_token'
        }
        headers = {
            'Authorization': 'Bearer ' + token
        }

        res = requests.get(self.url + 'v1/tracks/' + song_id, data=data, headers=headers)
        res.raise_for_status()

        res = res.json()

        return Song(song_id=sdata[0], title=sdata[1], img_file=sdata[2], artists=sdata[3], spotify_uri=sdata[4], genres=sdata[5], explicit=sdata[6], duration=sdata[7], preview_url=sdata[8])


spotifyManager = SpotifyManager()
