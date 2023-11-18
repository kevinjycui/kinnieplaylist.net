import mariadb
import yaml
import re
import sys

sys.path.insert(0, 'data')

from character import Character, CharacterList

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

user_conn = mariadb.connect(
    host = config['mariadb']['host'],
    port = config['mariadb']['port'],
    user = 'user')

user = user_conn.cursor()
user.execute('USE mixato')

def san(sql):
    return re.sub(r'\W+', '', str(sql))

class Database:
    def get_characters(self):
        user.execute('SELECT * FROM characters')
        data_list = list(user)
        character_list = [Character(character_id=data[0], name=data[1], img_file=data[2], media=data[3], external_url=data[4]) for data in data_list]
        return CharacterList(character_list)

    def get_character(self, character_id):
        character_id = san(character_id)

        user.execute('SELECT name, img_file, media, external_url FROM characters WHERE character_id = {}'.format(character_id))
        data = list(user)

        if len(data) != 1:
            raise RuntimeException('Failed to fetch character with id {}'.format(character_id))

        data = data[0]

        return Character(character_id, name=data[0], img_file=data[1], media=data[2], external_url=data[3])
        
