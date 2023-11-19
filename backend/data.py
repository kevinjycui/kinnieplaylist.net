import mariadb
import yaml
import re
import sys

sys.path.insert(0, 'data')

from character import Character, CharacterList
from song import Song, Playlist

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

user_conn = mariadb.connect(
    host = config['mariadb']['host'],
    port = config['mariadb']['port'],
    user = 'user')

user = user_conn.cursor()
user.execute('USE kinnieplaylist')

def san(sql):
    return re.sub(r'\W+', '', str(sql))

class Database:
    def get_characters(self):
        user.execute('SELECT * FROM characters')
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], path=data[4]) for data in data_list]
        return CharacterList(character_list)

    def get_character(self, character_id):
        character_id = san(character_id)

        user.execute('SELECT name, img_file, media, path FROM characters WHERE character_id = {} LIMIT 1'.format(character_id))
        data = list(user)

        if len(data) != 1:
            raise RuntimeException('Failed to fetch character with id {}'.format(character_id))

        data = data[0]

        return Character(character_id, name=data[0], img_file=data[1], media=data[2], path=data[3])

    def get_character_by_path(self, path):
        path = san(path)

        user.execute('SELECT character_id, name, img_file, media, path FROM characters WHERE path = \'{}\' LIMIT 1'.format(path))
        data = list(user)

        if len(data) != 1:
            raise RuntimeException('Failed to fetch character with path {}'.format(path))

        data = data[0]

        return Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], path=path)
        
    def get_character_songs(self, character_id):
        character_id = san(character_id)

        user.execute('SELECT song_id FROM character_song_connections WHERE character_id = {}'.format(character_id))
        data_list = list(user)

        playlist = Playlist()

        for data in datalist:
            user.execute('SELECT * FROM songs WHERE song_id = {} LIMIT 1'.format(data[0]))
            song_data = list(user)

            if len(song_data) != 1:
                raise RuntimeException('Failed to fetch song with id {}'.format(data[0]))

            song_data = song_data[0]

            playlist.append(Song(song_id=sdata[0], spotify_id=sdata[1], title=sdata[2], img_file=sdata[3], artists=sdata[4], spotify_uri=sdata[5], genres=sdata[6], explicit=sdata[7], duration=sdata[8], preview_url=sdata[9]))

        return playlist
