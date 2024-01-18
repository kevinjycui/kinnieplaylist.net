# Add character

import sys

import mysql.connector
import yaml

if __name__ != '__main__':
    sys.exit()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn = mysql.connector.connect(
    host = config['mysql']['host'],
    port = config['mysql']['port'],
    user = config['mysql']['root']['user'],
    password = config['mysql']['root']['password'])

cur = conn.cursor()
cur.execute('USE kinnie')

current_media = ''

while True:
    if input('Add another character? (y/n) ').lower() != 'y':
        break

    name = input('\tName: ')
    name = name.strip()

    character_id = input('\tID (Leave blank to set name as ID): ')
    character_id = character_id.strip()
    if len(character_id) == 0:
        character_id = name.replace(' ', '_')

    img_file = input('\tImage URL: ')
    img_file = img_file.strip()
    if 'imgur.com/' in img_file and img_file.count('.') == 1:
        img_file = img_file.replace('imgur.com/', 'i.imgur.com/') + '.webp'

    media = input('\tMedia (Leave blank to set same as last): ' if len(current_media) > 0 else '\tMedia: ')
    media = media.strip()
    if len(media) == 0 and len(current_media) > 0:
        media = current_media
    current_media = media

    media2 = input('\tMedia 2: ' if len(current_media) > 0 else '\tMedia: ')
    media2 = media.strip()

    if media2 == '':
        cmd = '''REPLACE INTO characters SET
                            character_id = %s,
                            name = %s,
                            img_file = %s,
                            media = %s'''
    
        print(cmd % (character_id, name, img_file, media))

        cur = conn.cursor()
        cur.execute(cmd, (character_id, name, img_file, media))

    else:
        cmd = '''REPLACE INTO characters SET
                            character_id = %s,
                            name = %s,
                            img_file = %s,
                            media = %s,
                            media2 = %s'''
    
        print(cmd % (character_id, name, img_file, media, media2))

        cur = conn.cursor()
        cur.execute(cmd, (character_id, name, img_file, media, media2))

    if input('Is this information correct? (y/n) ').lower() != 'y':
        conn.rollback()
    else:
        conn.commit()
        print('Added successfully!')
