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

def sql_run_logged(cmd, args=tuple()):
    print(cmd, end=';\n')
    cur = conn.cursor()
    if len(args) == 0:
        cur.execute(cmd)
    else:
        cur.execute(cmd, args)

sql_run_logged('DROP DATABASE IF EXISTS kinnie')
sql_run_logged('CREATE DATABASE kinnie')

sql_run_logged('USE kinnie')

sql_run_logged('''CREATE TABLE characters 
                    (character_id VARCHAR(255) NOT NULL,
                    name VARCHAR(255),
                    img_file VARCHAR(255),
                    media VARCHAR(255),

                    PRIMARY KEY(character_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''CREATE TABLE songs 
                    (song_id VARCHAR(255),
                    title VARCHAR(255), 
                    img_file VARCHAR(255), 
                    artists VARCHAR(255),
                    genres VARCHAR(255),
                    explicit BOOL,
                    duration INT,

                    PRIMARY KEY(song_id))
                 CHARACTER SET utf8 COLLATE utf8_unicode_ci''')

sql_run_logged('''CREATE TABLE character_song_connections 
                    (song_id VARCHAR(255),
                    character_id VARCHAR(255),
                    user_id VARCHAR(255))''')

app_user = config['mysql']['app']['user']
app_pswd = config['mysql']['app']['password']

sql_run_logged('DROP USER IF EXISTS %s', (app_user,))
sql_run_logged('CREATE USER %s IDENTIFIED BY %s', (app_user, app_pswd))
sql_run_logged('GRANT SELECT ON kinnie.* TO %s', (app_user,))
sql_run_logged('GRANT INSERT ON kinnie.songs TO %s', (app_user,))
sql_run_logged('GRANT INSERT ON kinnie.character_song_connections TO %s', (app_user,))
sql_run_logged('GRANT DELETE ON kinnie.character_song_connections TO %s', (app_user,))

sql_run_logged('FLUSH PRIVELEGES')

conn.commit()
