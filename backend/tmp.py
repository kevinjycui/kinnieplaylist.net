# Migrate images

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
    cmd = '''SELECT character_id, name FROM characters ORDER BY img_file ASC'''
    cur = conn.cursor()
    cur.execute(cmd)
    datalist = list(cur)

    for data in datalist:
        character_id = data[0]
        name = data[1]

        while True:
            print(name)
            img_file = input('Image link:\n> ').replace('www.', 'dl.').replace('dl=0', 'raw=1')
            if img_file != '':
                print(img_file)
                cmd = '''UPDATE characters SET img_file = %s WHERE character_id = %s'''
                cur = conn.cursor()
                cur.execute(cmd, (img_file, character_id))
                print(cur)

                if input('Is this information correct? (y/n) ').lower() != 'y':
                    conn.rollback()
                else:
                    conn.commit()
                    print('Updated successfully!')
                    break