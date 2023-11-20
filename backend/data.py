import mariadb
import yaml
import re
import sys

sys.path.insert(0, 'data')

from character import Character, CharacterList
from song import Song, Playlist


class NotFoundError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

pool = mariadb.ConnectionPool(
    host=config['mariadb']['host'],
    port=config['mariadb']['port'],
    user="user",
    pool_name="web-app",
    pool_size=20)

def connect():
    try:
        user_conn = pool.get_connection()
    except mariadb.PoolError as e:
        user_conn = mariadb.connect(
            host = config['mariadb']['host'],
            port = config['mariadb']['port'],
            user = 'user')
    user = user_conn.cursor()
    user.execute('USE kinnie')
    return user, user_conn

def san(sql):
    return re.sub(r'\W+', '', str(sql))

class Database:
    def get_characters(self):
        user, user_conn = connect()
        user.execute('SELECT character_id, name, img_file, media FROM characters')
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3]) for data in data_list]
        return CharacterList(character_list)

    def get_character(self, character_id):
        character_id = san(character_id)
        user, user_conn = connect()

        user.execute('SELECT name, img_file, media FROM characters WHERE character_id = \'{}\' LIMIT 1'.format(character_id))
        data = list(user)

        if len(data) != 1:
            raise NotFoundError('Failed to fetch character with character_id {}'.format(character_id))

        data = data[0]

        return Character(character_id=character_id, name=data[0], img_file=data[1], media=data[2])
        
    def get_character_songs(self, character_id, user_id = ''):
        character_id = san(character_id)
        user, user_conn = connect()

        user.execute('SELECT song_id FROM character_song_connections WHERE character_id = \'{}\''.format(character_id)
            + (' AND user_id = \'{}\''.format(user_id) if user_id != '' else ''))
        data_list = list(user)

        playlist = Playlist()

        for data in data_list:
            user.execute('SELECT song_id, title, img_file, artists, genres, explicit, duration FROM songs WHERE song_id = \'{}\' LIMIT 1'.format(data[0]))
            sdata = list(user)

            if len(sdata) != 1:
                raise NotFoundError('Failed to fetch song with id {}'.format(data[0]))

            sdata = sdata[0]

            playlist.append(Song(song_id=sdata[0], title=sdata[1], img_file=sdata[2], artists=sdata[3], genres=sdata[4], explicit=sdata[5], duration=sdata[6]))

        return playlist

    def get_song(self, song_id):
        user, user_conn = connect()
        song_id = san(song_id)

        user.execute('SELECT title, img_file, artists, genres, explicit, duration FROM songs WHERE song_id = \'{}\''.format(song_id))
        sdata = list(user)

        if len(sdata) == 0:
            return

        sdata = sdata[0]

        return Song(song_id=song_id, title=sdata[0], img_file=sdata[1], artists=sdata[2], genres=sdata[3], explicit=sdata[4], duration=sdata[5])

    def post_song(self, song_id, song_data):
        song_id = san(song_id)
        user, user_conn = connect()

        user.execute('''INSERT INTO songs SET
                    song_id = '{}',
                    title = '{}',
                    img_file = '{}',
                    artists = '{}',
                    genres = '{}',
                    explicit = {},
                    duration = {}
                    '''.format(
                        song_id,
                        song_data.title,
                        song_data.img_file,
                        song_data.artists,
                        song_data.genres,
                        song_data.explicit,
                        song_data.duration)
                    )
        user_conn.commit()

    def post_character_song(self, character_id, song_id, user_id):
        character_id = san(character_id)
        song_id = san(song_id)
        user_id = san(user_id)
        user, user_conn = connect()
        
        user.execute("SELECT * FROM character_song_connections WHERE character_id = '{}' AND song_id = '{}' AND user_id = '{}' LIMIT 1".format(
            character_id, song_id, user_id
        ))
        exist_data = list(user)
        
        if len(exist_data) > 0:
            return False

        user.execute('''INSERT INTO character_song_connections SET
            character_id = '{}',
            song_id = '{}',
            user_id = '{}'
        '''.format(character_id, song_id, user_id))
        user_conn.commit()

        return True
