import mysql.connector
import yaml
import re
import sys

sys.path.insert(0, 'data')

from character import Character, CharacterList
from song import Song, CompactPlaylist


class NotFoundError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="webserver", 
    pool_size=20,
    host=config['mysql']['host'],
    port=config['mysql']['port'],
    user = config['mysql']['app']['user'],
    password = config['mysql']['app']['password'])

def connect():
    try:
        user_conn = pool.get_connection()
    except mysql.connector.PoolError as e:
        user_conn = mysql.connector.connect(
            host = config['mysql']['host'],
            port = config['mysql']['port'],
            user = config['mysql']['app']['user'],
            password = config['mysql']['app']['password'])
    user = user_conn.cursor()
    user.execute('USE kinnie')
    return user, user_conn

class Database:
    def get_characters(self):
        user, user_conn = connect()
        cmd = "SELECT character_id, name, img_file, media FROM characters"
        user.execute(cmd)
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3]) for data in data_list]
        return CharacterList(character_list)

    def get_character(self, character_id):
        user, user_conn = connect()

        cmd = "SELECT name, img_file, media FROM characters WHERE character_id = %s LIMIT 1"
        user.execute(cmd, (character_id,))
        data = list(user)

        if len(data) != 1:
            raise NotFoundError('Failed to fetch character with character_id {}'.format(character_id))

        data = data[0]

        return Character(character_id=character_id, name=data[0], img_file=data[1], media=data[2])
        
    def get_character_songs(self, character_id, user_id = ''):
        user, user_conn = connect()

        if len(user_id) == 0:
            cmd = "SELECT song_id FROM character_song_connections WHERE character_id = %s"
            user.execute(cmd, (character_id,))
        else:
            cmd = "SELECT song_id FROM character_song_connections WHERE character_id = %s AND user_id = %s"
            user.execute(cmd, (character_id, user_id))

        return CompactPlaylist([data[0] for data in list(user)])

    def get_song(self, song_id):
        user, user_conn = connect()

        cmd = "SELECT title, img_file, artists, genres, explicit, duration FROM songs WHERE song_id = %s"
        user.execute(cmd, (song_id,))
        sdata = list(user)

        if len(sdata) == 0:
            return

        sdata = sdata[0]

        return Song(song_id=song_id, title=sdata[0], img_file=sdata[1], artists=sdata[2], genres=sdata[3], explicit=sdata[4], duration=sdata[5])

    def post_song(self, song_id, song_data):
        user, user_conn = connect()

        cmd = """INSERT INTO songs SET
                    song_id = %s,
                    title = %s,
                    img_file = %s,
                    artists = %s,
                    genres = %s,
                    explicit = %s,
                    duration = %s"""
        user.execute(cmd, (
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
        user, user_conn = connect()
        
        cmd = "SELECT * FROM character_song_connections WHERE character_id = %s AND song_id = %s AND user_id = %s LIMIT 1"
        user.execute(cmd, (character_id, song_id, user_id))
        exist_data = list(user)
        
        if len(exist_data) > 0:
            return False

        cmd = """INSERT INTO character_song_connections SET
            character_id = %s,
            song_id = %s,
            user_id = %s"""
        user.execute(cmd, (character_id, song_id, user_id))
        user_conn.commit()

        return True
