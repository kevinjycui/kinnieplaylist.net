import sys

import mariadb
import yaml

if __name__ != '__main__':
    sys.exit()

with open('config.yml', 'r') as file:
    config = yaml.safe_load(file)

conn = mariadb.connect(
    host = config['mariadb']['host'],
    port = config['mariadb']['port'],
    user = config['mariadb']['user'],
    password = config['mariadb']['password'])

def sql_run_logged(cmd):
    print(cmd, end=';\n')
    cur = conn.cursor()
    cur.execute(cmd)

sql_run_logged('USE kinnie')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Shinji_Ikari\',
                    name = \'Shinji Ikari\',
                    img_file = \'https://i.imgur.com/3m1mVBm.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Kaworu_Nagisa\',
                    name = \'Kaworu Nagisa\',
                    img_file = \'https://i.imgur.com/0sJd9Tt.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Rei_Ayanami\',
                    name = \'Rei Ayanami\',
                    img_file = \'https://i.imgur.com/EVvuDSU.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Asuka_Langley_Souryuu\',
                    name = \'Asuka Langley Souryuu\',
                    img_file = \'https://i.imgur.com/sZUj5BJ.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Misato_Katsuragi\',
                    name = \'Misato Katsuragi\',
                    img_file = \'https://i.imgur.com/66m0GU3.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Ritsuko_Akagi\',
                    name = \'Ritsuko Akagi\',
                    img_file = \'https://i.imgur.com/bv4fbnl.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Maya_Ibuki\',
                    name = \'Maya Ibuki\',
                    img_file = \'https://i.imgur.com/1OQM4qX.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Gendou_Ikari\',
                    name = \'Gendou Ikari\',
                    img_file = \'https://i.imgur.com/eN9jD8N.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Kaji_Ryouji\',
                    name = \'Kaji Ryouji\',
                    img_file = \'https://i.imgur.com/PpzU8FX.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Pen_Pen\',
                    name = \'Pen Pen\',
                    img_file = \'https://i.imgur.com/FHIFauH.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Kensuke_Aida\',
                    name = \'Kensuke Aida\',
                    img_file = \'https://i.imgur.com/IRu8VMV.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Touji Suzuhara\',
                    name = \'Touji Suzuhara\',
                    img_file = \'https://i.imgur.com/llvfrP7.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Kouzou_Fuyutsuki\',
                    name = \'Kouzou Fuyutsuki\',
                    img_file = \'https://i.imgur.com/CvxDPlh.jpg\',
                    media = \'Neon Genesis Evangelion\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Lain_Iwakura\',
                    name = \'Lain Iwakura\',
                    img_file = \'https://i.imgur.com/b1FgBKH.jpg\',
                    media = \'Serial Experiments Lain\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Ayumu_Kasuga_(Osaka)\',
                    name = \'Ayumu "Osaka" Kasuga\',
                    img_file = \'https://i.imgur.com/pyD4Z0G.jpg\',
                    media = \'Azumanga Daioh\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Sakaki\',
                    name = \'Sakaki\',
                    img_file = \'https://i.imgur.com/bNzYjI8.jpg\',
                    media = \'Azumanga Daioh\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Chiyo_Mihama\',
                    name = \'Chiyo Mihama\',
                    img_file = \'https://i.imgur.com/wX1uV5Z.jpg\',
                    media = \'Azumanga Daioh\'''')

sql_run_logged('''INSERT IGNORE INTO characters SET
                    character_id = \'Tomo_Takino\',
                    name = \'Tomo Takino\',
                    img_file = \'https://i.imgur.com/sTz8zfJ.jpg\',
                    media = \'Azumanga Daioh\'''')

conn.commit()