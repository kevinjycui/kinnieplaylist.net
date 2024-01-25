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
    cmd = '''SELECT name FROM characters ORDER BY img_file ASC'''
    cur = conn.cursor()
    cur.execute(cmd)
    names = list(cur)

    for name in names:
        name = name[0]

        while True:
            print(name)
            img_file = input('Image link:\n> ').replace('www.', 'dl.').replace('dl=0', 'raw=1')
            if img_file != '':
                cmd = '''UPDATE characters SET img_file = %s WHERE name = %s'''
                print(cmd % (img_file, name))
                cur = conn.cursor()
                cur.execute(cmd, (img_file, name))

                if input('Is this information correct? (y/n) ').lower() != 'y':
                    conn.rollback()
                else:
                    conn.commit()
                    print('Updated successfully!')
                    break