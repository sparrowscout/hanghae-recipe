from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca = certifi.where()

client = MongoClient('mongodb+srv://test:sparta@cluster0.bad8f.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbsparta


@app.route('/')
def login():
    return render_template('index.html')


@app.route('/mypage')
def mypage():
    my_id = "Sparta"
    return render_template("mypage.html", id=my_id)


@app.route("/main")
def main():
    my_id = "Sparta"
    return render_template("main.html", id=my_id)


@app.route("/main", methods=["GET"])
def main_cards():
    sample_receive = request.form['sample_give']
    print(sample_receive)
    return jsonify({'msg': 'POST 연결 완료!'})


@app.route("/sample", methods=["GET"])
def sample_get():
    return jsonify({'msg': 'GET 연결 완료!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
