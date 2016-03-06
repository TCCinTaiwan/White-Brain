import random
from flask import Flask, render_template, request, send_file, redirect
from flask import send_from_directory, url_for, jsonify
from logging.handlers import RotatingFileHandler
import logging
import base64
import os
import sys
import re
from datetime import datetime
import platform
app = Flask(__name__, static_url_path = "", static_folder = "static")
room_status = {"test" : {"0" : ""}} # yyyy-MM-dd HH:mm:ss

def randomBrainId():
    room_id = random.choice(list(room_status.keys()))
    return str(room_id)
def newBrainId():
    room_id = ''
    while room_id == '' or room_id in room_status:
        for x in range(0, 5):
            random_char = random.randrange(0, 62)
            room_id += chr(random_char % 26 +( 48 if (random_char // 26 == 2) else 65 if (random_char // 26 == 0) else 97))
    return str(room_id)
def main():
    print("    'White's Brain' Copyright (C) 2016  TCC")
    print("    This program comes with ABSOLUTELY NO WARRANTY.")
    print("    This is free software, and you are welcome to redistribute itunder certain conditions.")
    file_handler = RotatingFileHandler('info.log', 'a', 10 * 1024 * 1024, 10)
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('startup')
    app.run(host = os.getenv('IP', "0.0.0.0"), port = int(os.getenv('PORT', 80)), debug = True)
@app.route('/') #首頁
def index():
    return render_template('index.htm')
@app.route('/b/')
def newBrain(): # 指定新房間
    room_id = newBrainId()
    app.logger.info('newBrain{ip:' + request.remote_addr + ', rid:' + room_id + '}')
    return redirect("/b/"+ room_id)
@app.route('/b/<room_id>', methods = ["POST", "GET"])
def showBrain(room_id):
    if request.method == "POST":
        app.logger.info('upload')
        user_id = request.form['user_id']
        DataURL = request.form['DataURL'] # datauri = 'data:image/png;base64,iVBORw0K...'
        ImageData = base64.b64decode(re.search(r'base64,(.*)', DataURL).group(1).encode())
        with open(os.path.join('static', 'room', room_id + '_' + user_id + '.png'), 'wb') as output:
            output.write(ImageData)
        if not room_id in room_status:
            room_status[room_id] = {}
        room_status[room_id][user_id] = str(datetime.now())
        print(str(datetime.now()) + " " + str(room_id) + "房間，" + str(user_id) + "上傳圖片", file = sys.stderr)
        return "" # send_file('static\\room\\' + room_id + '_' + user_id + '.png', mimetype = 'image/png')
    else:
        user_id = random.randrange(0, 1)
        app.logger.info('intoBrain{ip:' + request.remote_addr + ', rid:' + room_id + '}')
        print("使用" + str(room_id) + "房間，ID:" + str(user_id), file = sys.stderr)
        return render_template('brain.htm', user_id = user_id)
@app.route('/b_status/') # 隨機房間[房間狀態]
def randomBrainStatus():
    room_id = randomBrainId()
    app.logger.info('randomBrainStatus{ip:' + request.remote_addr + ', rid:' + room_id + '}')
    return redirect("/b_status/" + room_id)
@app.route('/b_status/<room_id>', methods = ["POST", "GET"]) # 房間狀態
def showBrainStatus(room_id):
    if request.method == "POST":
        user_id = request.form['uid'] # 人數, 更新時間
        if not room_id in room_status:
            return jsonify({})
        else:
            print(room_id + "房" + user_id + "，要求", room_status[room_id], file = sys.stderr)
            return jsonify({room_id : room_status[room_id]})
    else:
        if not room_id in room_status:
            return jsonify({})
        else:
            print(room_id + "房(使用者)，要求", room_status[room_id], file = sys.stderr)
            return jsonify({room_id : room_status[room_id]})
@app.route('/b_view/') # 隨機房間[觀察者模式]
def randomReadOnlyTestBrain():
    room_id = randomBrainId()
    app.logger.info('randomReadOnlyTestBrain{ip:' + request.remote_addr + ', rid:' + room_id + '}')
    return redirect("/b_view/"+ room_id)
@app.route('/b_view/<room_id>') # 觀察者模式
def showReadOnlyTestBrain(room_id):
    return render_template('brainReadOnly.htm')
if __name__ == '__main__':
    main()