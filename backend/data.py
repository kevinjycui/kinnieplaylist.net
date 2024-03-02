import mysql.connector
import yaml
import re
import sys

sys.path.insert(0, 'data')

from character import Character, CharacterList, CharacterID, MediaList
from song import Song, CountedPlaylist, Playlist
from vote import AnonVote, VoteList


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

def filter_cmd_head(q, fandom, status, user_id=''):
    cmd = "WITH filtered AS (SELECT * FROM characters\n"

    params = []
    filtered = False
    
    if q != '':
        cmd += "WHERE (UPPER(characters.name) LIKE UPPER(%s) OR UPPER(characters.media) LIKE UPPER(%s) OR UPPER(characters.media2) LIKE UPPER(%s))\n"
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
        filtered = True

    if fandom != "":
        cmd += ("AND" if filtered else "WHERE") + " (characters.media = %s OR characters.media2 = %s)\n"
        params.extend([fandom, fandom])
        filtered = True

    if status == '':
        cmd += """
            ORDER BY 
            (
                SELECT COUNT(DISTINCT character_song_connections.user_id) FROM character_song_connections 
                WHERE character_song_connections.character_id = characters.character_id
            ) DESC,
            (
                SELECT COUNT(*) FROM character_song_connections 
                WHERE character_song_connections.character_id = characters.character_id
            ) DESC,
            REPLACE(name, '"', '') ASC
        """

    elif status == 'voted':
        cmd += ("AND" if filtered else "WHERE") + """
            characters.character_id IN (SELECT DISTINCT character_id FROM character_song_connections WHERE user_id = %s)
            ORDER BY REPLACE(name, '"', '') ASC
        """
        params.append(user_id)

    elif status == 'not voted':
        cmd += ("AND" if filtered else "WHERE") + """
            characters.character_id NOT IN (SELECT DISTINCT character_id FROM character_song_connections WHERE user_id = %s)
            ORDER BY REPLACE(name, '"', '') ASC
        """
        params.append(user_id)

    cmd += ")\n"

    return cmd, params

class Database:
    def get_characters(self, q='', fandom='', status='', limit=72, offset=0, user_id=''):
        user, user_conn = connect()

        cmd, params = filter_cmd_head(q, fandom, status, user_id)

        cmd += "SELECT COUNT(*), character_id, name, img_file, media, media2 FROM filtered GROUP BY character_id LIMIT %s OFFSET %s"
        params.append(limit)
        params.append(offset)

        user.execute(cmd, tuple(params))
        data_list = list(user)
        total_count = data_list[0][0]
        character_list = [Character(character_id=data[1], name=data[2], img_file=data[3], media=data[4], media2=data[5]) for data in data_list]
        return CharacterList(character_list, total_count)

    def get_character(self, character_id):
        user, user_conn = connect()

        cmd = "SELECT name, img_file, media, media2 FROM characters WHERE character_id = %s LIMIT 1"
        user.execute(cmd, (character_id,))
        data = list(user)

        if len(data) != 1:
            raise NotFoundError('Failed to fetch character with character_id {}'.format(character_id))

        data = data[0]

        return Character(character_id=character_id, name=data[0], img_file=data[1], media=data[2], media2=data[3])
        
    def get_medias(self, q='', fandom='', status='', user_id=''):
        user, user_conn = connect()

        cmd, params = filter_cmd_head(q, fandom, status, user_id)

        cmd += "(SELECT DISTINCT media FROM filtered UNION SELECT DISTINCT media2 FROM filtered WHERE media2 IS NOT NULL) ORDER BY media ASC"
        
        user.execute(cmd, tuple(params))
        data_list = list(user)
        return MediaList([data[0] for data in data_list])

    def get_character_songs(self, character_id, user_id = ''):
        user, user_conn = connect()

        if len(user_id) == 0:
            cmd = "SELECT song_id, COUNT(*) FROM character_song_connections WHERE character_id = %s GROUP BY song_id ORDER BY COUNT(*) DESC, RAND()"
            user.execute(cmd, (character_id,))
            return CountedPlaylist(list(user))
        else:
            cmd = "SELECT song_id FROM character_song_connections WHERE character_id = %s AND user_id = %s"
            user.execute(cmd, (character_id, user_id))
            return Playlist([data[0] for data in list(user)])

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

        cmd = """
        INSERT INTO songs SET
            song_id = %s,
            title = %s,
            img_file = %s,
            artists = %s,
            genres = %s,
            explicit = %s,
            duration = %s
        """
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

        cmd = """
            INSERT INTO character_song_connections SET
            character_id = %s,
            song_id = %s,
            user_id = %s
        """
        user.execute(cmd, (character_id, song_id, user_id))
        user_conn.commit()

        return True

    def delete_character_song(self, character_id, song_id, user_id):
        user, user_conn = connect()
        
        cmd = "SELECT * FROM character_song_connections WHERE character_id = %s AND song_id = %s AND user_id = %s LIMIT 1"
        user.execute(cmd, (character_id, song_id, user_id))
        exist_data = list(user)
        
        if len(exist_data) == 0:
            return False

        cmd = """
            DELETE FROM character_song_connections WHERE
            character_id = %s AND
            song_id = %s AND
            user_id = %s
        """
        user.execute(cmd, (character_id, song_id, user_id))
        user_conn.commit()

        return True

    def get_latest_votes(self):
        user, user_conn = connect()

        cmd = """
            SELECT character_song_connections.character_id, characters.name, characters.img_file, characters.media, characters.media2, character_song_connections.song_id, songs.title, songs.img_file, songs.artists, songs.genres, songs.explicit, songs.duration
            FROM character_song_connections 
            INNER JOIN characters ON character_song_connections.character_id = characters.character_id 
            INNER JOIN songs on character_song_connections.song_id = songs.song_id 
            ORDER BY character_song_connections.id DESC LIMIT 50
        """
        user.execute(cmd)
        data_list = list(user)
        vote_list = [AnonVote(
                        Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], media2=data[4]), 
                        Song(song_id=data[5], title=data[6], img_file=data[7], artists=data[8], genres=data[9], explicit=data[10], duration=data[11])) for data in data_list]
        return VoteList(vote_list)

    def get_all_votes_by(self, user_id, limit, offset):
        user, user_conn = connect()

        cmd = """
            SELECT character_song_connections.character_id, characters.name, characters.img_file, characters.media, characters.media2, character_song_connections.song_id, songs.title, songs.img_file, songs.artists, songs.genres, songs.explicit, songs.duration
            FROM character_song_connections
            INNER JOIN characters ON character_song_connections.character_id = characters.character_id 
            INNER JOIN songs on character_song_connections.song_id = songs.song_id 
            WHERE character_song_connections.user_id = %s
            ORDER BY character_song_connections.id DESC
            LIMIT %s OFFSET %s
        """
        user.execute(cmd, (user_id, limit, offset))
        data_list = list(user)
        vote_list = [AnonVote(
                        Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], media2=data[4]), 
                        Song(song_id=data[5], title=data[6], img_file=data[7], artists=data[8], genres=data[9], explicit=data[10], duration=data[11])) for data in data_list]
        return VoteList(vote_list)

    def get_random_character(self):
        user, user_conn = connect()

        cmd = "SELECT character_id FROM characters ORDER BY RAND() LIMIT 1"
        user.execute(cmd)
        data = list(user)

        if len(data) != 1:
            raise NotFoundError('Failed to fetch random character')

        character_id = data[0][0]

        return CharacterID(character_id)

    def get_similar_characters(self, character_id):
        user, user_conn = connect()

        cmd = """
            SELECT character_song_connections.character_id, characters.name, characters.img_file, characters.media, characters.media2 FROM character_song_connections
            INNER JOIN
            characters ON characters.character_id = character_song_connections.character_id 
            WHERE NOT character_song_connections.character_id = %s 
            AND song_id IN 
            (SELECT song_id FROM character_song_connections WHERE character_song_connections.character_id = %s)
            GROUP BY character_song_connections.character_id
            ORDER BY COUNT(*) DESC, RAND() LIMIT 5;
        """
        user.execute(cmd, (character_id, character_id))
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], media2=data[4]) for data in data_list]
        return CharacterList(character_list)

    def get_top_characters_voted_by(self, user_id):
        user, user_conn = connect()

        cmd = """
            SELECT character_song_connections.character_id, characters.name, characters.img_file, characters.media, characters.media2 FROM character_song_connections
            INNER JOIN
            characters ON characters.character_id = character_song_connections.character_id
            WHERE character_song_connections.user_id = %s
            GROUP BY character_song_connections.character_id
            ORDER BY COUNT(*) DESC,  REPLACE(characters.name, '"', '') ASC LIMIT 24
        """
        user.execute(cmd, (user_id,))
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], media2=data[4]) for data in data_list]
        return CharacterList(character_list)
