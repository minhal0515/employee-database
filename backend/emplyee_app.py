from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "engineers")
    )

@app.route('/api/employees')
def get_employees():
    eid = request.args.get('eid')
    erole = request.args.get('erole')
    ename = request.args.get('ename')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if eid:
            cursor.execute("SELECT * FROM employees WHERE id = %s", (eid,))
            result = cursor.fetchone()
            return jsonify(result if result else {})
        elif erole:
            search_term = f"%{erole}%"
            cursor.execute("SELECT * FROM employees WHERE LOWER(emp_role) LIKE LOWER(%s)", (search_term,))
            results = cursor.fetchall()
            return jsonify(results if results else [])
        elif ename:
            search_term = f"%{ename}%"
            cursor.execute("""
            SELECT * FROM employees
            WHERE first_name LIKE %s
                OR last_name LIKE %s
                OR CONCAT(first_name, ' ', last_name) LIKE %s
                """, (search_term, search_term, search_term))
            results = cursor.fetchall()
            return jsonify(results if results else {})
        else:
            cursor.execute("SELECT * FROM employees")
            results = cursor.fetchall()
            return jsonify(results)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    finally:
        cursor.close()
        conn.close()

@app.route('/api/employee_salaries')
def get_employee_salaries():
    eid = request.args.get('id')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        if eid:
            cursor.execute("SELECT salary FROM salaries WHERE employee_id = %s", (eid,))
            result = cursor.fetchone()
            return jsonify(result if result else {})
        else:
            cursor.execute("SELECT * FROM salaries")
            results = cursor.fetchall()
            return jsonify(results)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)})
    finally:
        cursor.close()
        conn.close()

@app.route('/api/add_employee', methods=['POST'])
def add_employee():
    data = request.get_json()
    age = data.get('age')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    gender = data.get('gender')
    phone_number = data.get('phone_number')
    emp_role = data.get('emp_role')
    salary = data.get('salary')
    
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        insert_employee = """INSERT INTO employees (age, email, first_name, last_name, gender, phone_number, emp_role) VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(insert_employee, (age, email, first_name, last_name, gender, phone_number, emp_role))        
        emp_id = cursor.lastrowid
        insert_salary = "INSERT INTO salaries (emp_id, salary) VALUES (%s, %s)"
        cursor.execute(insert_salary, (emp_id, salary)) 
        conn.commit()
        return jsonify({
            "message": "Employee and salary added successfully",
            "emp_id": emp_id
        }), 201
        
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=8000)
