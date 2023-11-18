import yaml
import requests
import json
import time
import random
import string

from flask import redirect


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

        self.access_token = ''

    def server_at(self, path):
        return self.server_url + path

    def generate_auth_code(self):
        scope = 'streaming user-read-email user-read-private'
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

        self.access_token = res['access_token']
        self.refresh_token = res['refresh_token']
        self.expiration = time.time() + res['expires_in']

spotifyManager = SpotifyManager()
