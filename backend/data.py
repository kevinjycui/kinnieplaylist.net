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

    def get_character_by_path(self, path):
        path = san(path)

        user.execute('SELECT character_id, name, img_file, media FROM characters WHERE path = \'{}\' LIMIT 1'.format(path))
        data = list(user)

        if len(data) != 1:
            raise RuntimeError('Failed to fetch character with path {}'.format(path))

        data = data[0]

        return Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], path=path)
        
    def get_character_songs_by_path(self, path, user_id = ''):
        path = san(path)

        user.execute('SELECT song_id FROM character_song_connections WHERE character_path = \'{}\''.format(path)
            + (' AND user_id = \'{}\''.format(user_id) if user_id != '' else ''))
        data_list = list(user)

        playlist = Playlist()

        for data in data_list:
            user.execute('SELECT * FROM songs WHERE song_id = \'{}\' LIMIT 1'.format(data[0]))
            sdata = list(user)

            if len(sdata) != 1:
                raise RuntimeError('Failed to fetch song with id {}'.format(data[0]))

            sdata = sdata[0]

            playlist.append(Song(song_id=sdata[0], title=sdata[1], img_file=sdata[2], artists=sdata[3]))

        return playlist

    def get_song(self, song_id):
        song_id = san(song_id)

        user.execute('SELECT title, img_file, artists FROM songs WHERE song_id = \'{}\''.format(song_id))
        sdata = list(user)

        if len(sdata) == 0:
            return

        sdata = sdata[0]

        return Song(song_id=song_id, title=sdata[0], img_file=sdata[1], artists=sdata[2])

    def post_song(self, song_id, song_data):
        song_id = san(song_id)

        user.execute('''INSERT INTO songs SET
                    song_id = '{}',
                    title = '{}',
                    img_file = `{}`,
                    artists = '{}'
                    '''.format(
                        song_id,
                        song_data.title,
                        song_data.img_file,
                        ', '.join(song_data.artists))
                    )
        user_conn.commit()

    def post_character_song(self, character_path, song_id, user_id):
        character_path = san(character_path)
        song_id = san(song_id)
        user_id = san(user_id)
        
        user.execute("SELECT * FROM character_song_connections WHERE character_path = '{}' AND song_id = '{}' AND user_id = '{}' LIMIT 1".format(
            character_path, song_id, user_id
        ))
        exist_data = list(user)
        
        if len(exist_data) > 0:
            return False

        user.execute('''INSERT INTO character_song_connections SET
            character_path = '{}',
            song_id = '{}',
            user_id = '{}'
        '''.format(character_path, song_id, user_id))
        user_conn.commit()

        return True
