from flask import Flask, request  , jsonify
import myCar as car
import json
from flask_cors import CORS, cross_origin
import mysql.connector
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from users import User
import bcrypt 
import os
import json
import datetime
from functools import wraps

app = Flask(__name__)
cors = CORS(app)

mydb = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="",
            database="crudcar"
        )
   
# les web methods 

@app.route('/' , methods = ['GET'])
def Home():
    return 'Hello, Its Home Page !'


@app.route('/savecar' , methods = ['POST'])
def saveCar():
    args = request.json
    id_car = args.get('id')
    model = args.get('model')
    hp = args.get('hp')
    marque = args.get('marque')

    myCursor = mydb.cursor()

    mycar = car.Car(0 , model ,hp , marque )
    req = "insert into car (model , hp , marque ) values (%s , %s , %s)"
    val = (mycar.model , mycar.hp , mycar.marque)
    myCursor.execute(req , val)
    mydb.commit()
    print(myCursor.rowcount, "record ins")

  
    return "Saved : "


@app.route('/cars' , methods = ['GET'])
def getCars():
    mylist = []
    req = "select * from car"
    

    myCursor = mydb.cursor()
    myCursor.execute(req)
    myresult = myCursor.fetchall()
    for x in myresult:
        mylist.append(car.Car(x[0] ,x[1], x[2] , x[3]).__dict__)

    return json.dumps(mylist)


@app.route('/deletecar/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    print(car_id)
    myCursor = mydb.cursor()

    req = "DELETE FROM car WHERE id_car = %s"
    val = (car_id,)
    myCursor.execute(req, val)
    mydb.commit()
    print(myCursor.rowcount, "record(s) deleted")

    return jsonify({"message": "Car deleted"})




@app.route('/editcar/<int:car_id>', methods=['PUT'])
def edit_car(car_id):
    
    args = request.json
    model = args.get('model')
    hp = args.get('hp')
    marque = args.get('marque')
    print(car_id)
    print(model)

    myCursor = mydb.cursor()

    req = "UPDATE car SET model = %s, hp = %s, marque = %s WHERE id_car = %s"
    val = (model, hp, marque, car_id)
    myCursor.execute(req, val)
    mydb.commit()
    print(myCursor.rowcount, "record(s) updated")

    return "Car updated"

@app.route('/login',methods=['PUT'])
def login():
    try:
        username = request.json.get("username", None)
        password = request.json.get("password", None)

        if not username or not password or len(username) < 3 or len(password) < 3:
            return jsonify({"data": "Bad username or password"}), 401

        cursor = mydb.cursor()
        req = "SELECT * FROM users WHERE username = %s"
        val = (username,)
        cursor.execute(req, val)
        result = cursor.fetchone()
        if result is None:
            return jsonify({"status": "error", "data": "Bad username or password"}), 401
        user = User(result[1], result[2])
        compare_passwords = bcrypt.checkpw(password.encode('utf8'), user.password.encode('utf8'))
        if not compare_passwords:
            return jsonify({"status": "error", "data": "Bad username or password"}), 401

        access_token = create_access_token(identity=username)
        return jsonify({"status": "success", "data": {"jwt": access_token}}), 201
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "data": "An error has occurred"}), 401
    

@app.route('/register' , methods = ['POST'])
def register():
    try:
        username = request.json.get("username", None)
        password = request.json.get("password", None)
        cursor = mydb.cursor()
        req = "INSERT INTO mydb.users (username, password) VALUES (%s, %s)"
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf8'), salt)
        user = User(username, hashed_password)
        val = (user.name, user.password)
        cursor.execute(req, val)
        mydb.commit()
        access_token = create_access_token(identity=username)
        return jsonify({"status": "success", "data": {"jwt": access_token}}), 201
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "data": "An error has occurred"}), 401
 
if __name__ == '__main__':
   app.run(host="0.0.0.0", port="5000", debug=True)