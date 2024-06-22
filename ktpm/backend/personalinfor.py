from flask import jsonify, request, render_template, Blueprint
import mysql.connector
import logging

bp = Blueprint('personalinfor', __name__)


logging.basicConfig(level=logging.DEBUG)

db_status = "Chưa kết nối đến MySQL."

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Kan-1411",
        database="register"
    )
    if db.is_connected():
        db_status = "Kết nối thành công đến cơ sở dữ liệu MySQL."
        logging.info(db_status)
except mysql.connector.Error as err:
    db_status = f"Lỗi kết nối đến cơ sở dữ liệu MySQL: {err}"
    logging.error(db_status)

@bp.route('/')
def home():
    return render_template('personalinfor.html', db_status=db_status)

@bp.route('/userinfo', methods=['GET'])
def get_user_info():
    username = request.args.get('username')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    cursor = db.cursor(dictionary=True)
    query = "SELECT username, name, gender, role, area, phone, academic FROM users WHERE username = %s"
    logging.debug(f"Executing query: {query} with username={username}")
    
    try:
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        logging.debug(f"Query result: {result}")
    except mysql.connector.Error as err:
        logging.error(f"SQL Error: {err}")
        return jsonify({"error": "Database query error"}), 500
    finally:
        cursor.close()

    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "User not found"}), 404

