from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Kan-1411",
        database="register"
    )
    if db.is_connected():
        app.logger.info("Kết nối thành công đến cơ sở dữ liệu MySQL.")
except mysql.connector.Error as err:
    app.logger.error(f"Error: {err}")

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        app.logger.debug(f"Received data for login: {data}")

        if not data:
            return jsonify({"error": "No data provided"}), 400

        username = data.get('username')
        password = data.get('password')
        
        app.logger.debug(f"Username: {username}, Password: {password}")

        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM admin WHERE username = %s AND password = %s"
        app.logger.debug(f"Executing query: {query} with username: {username} and password: {password}")
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
        
        app.logger.debug(f"Query result: {user}")

        if user:
            response = {'message': 'Đăng nhập thành công!', 'name': user['username'], 'username': user['username']}
        else:
            response = {'message': 'Tài khoản hoặc mật khẩu lỗi'}, 401
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi đăng nhập: {err}")
        response = {'message': f'Lỗi khi đăng nhập: {err}'}, 500
    finally:
        cursor.close()
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5013, debug=True)
