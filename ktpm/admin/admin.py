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
    app.logger.error(f"Error connecting to MySQL: {err}")

@app.route('/users', methods=['GET'])
def get_users():
    cursor = None
    try:
        cursor = db.cursor(dictionary=True)
        query = "SELECT id, username, name, gender, role, area, phone, academic FROM users"
        cursor.execute(query)
        users = cursor.fetchall()
        app.logger.debug(f"Users fetched: {users}")
        return jsonify(users)
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi lấy danh sách người dùng: {err}")
        return jsonify({'message': f'Lỗi khi lấy danh sách người dùng: {err}'}), 500
    finally:
        if cursor:
            cursor.close()

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    cursor = None
    try:
        cursor = db.cursor()
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        db.commit()
        return jsonify({'message': 'Người dùng đã bị xóa thành công!'})
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi xóa người dùng: {err}")
        return jsonify({'message': f'Lỗi khi xóa người dùng: {err}'}), 500
    finally:
        if cursor:
            cursor.close()

@app.route('/forms', methods=['GET'])
def get_forms():
    cursor = None
    try:
        cursor = db.cursor(dictionary=True)
        query = "SELECT * FROM form WHERE approved = FALSE"
        cursor.execute(query)
        forms = cursor.fetchall()
        app.logger.debug(f"Forms fetched: {forms}")
        return jsonify(forms)
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi lấy danh sách form: {err}")
        return jsonify({'message': f'Lỗi khi lấy danh sách form: {err}'}), 500
    finally:
        if cursor:
            cursor.close()

@app.route('/forms/<int:form_id>/approve', methods=['POST'])
def approve_form(form_id):
    cursor = None
    try:
        cursor = db.cursor()
        query = "UPDATE form SET approved = TRUE WHERE id = %s"
        cursor.execute(query, (form_id,))
        db.commit()
        return jsonify({'message': 'Form đã được duyệt thành công!'})
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi duyệt form: {err}")
        return jsonify({'message': f'Lỗi khi duyệt form: {err}'}), 500
    finally:
        if cursor:
            cursor.close()

@app.route('/forms/<int:form_id>', methods=['DELETE'])
def delete_form(form_id):
    cursor = None
    try:
        cursor = db.cursor()
        query = "DELETE FROM form WHERE id = %s"
        cursor.execute(query, (form_id,))
        db.commit()
        return jsonify({'message': 'Form đã bị xóa thành công!'})
    except mysql.connector.Error as err:
        app.logger.error(f"Lỗi khi xóa form: {err}")
        return jsonify({'message': f'Lỗi khi xóa form: {err}'}), 500
    finally:
        if cursor:
            cursor.close()

if __name__ == '__main__':
    app.run(port=5014, debug=True)
