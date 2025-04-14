from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS
import bcrypt


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User = {self.username}> <email = {self.email}> <password = {self.password}>'

user_args = reqparse.RequestParser()
user_args.add_argument('username', type=str,required=True, help='Username of the user')
user_args.add_argument('email', type=str, required=True, help='Email of the user')
user_args.add_argument('password', type=str, required=True, help='Password of the user')

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password': fields.String,
}

class users(Resource):
    @marshal_with(user_fields)
    def get(self):
        users = User.query.all()
        return users

    @marshal_with(user_fields)
    def post(self):
        args = user_args.parse_args()
        new_user = User(username=args['username'], email=args['email'], password=args['password'])
        db.session.add(new_user)
        db.session.commit()
        users = User.query.all()
        return users, 201

class user(Resource):
    @marshal_with(user_fields)
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        return user

    @marshal_with(user_fields)
    def patch(self, id):
        args = user_args.parse_args()
        user = User.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        if args['username']:
            user.username = args['username']
        if args['email']:
            user.email = args['email']
        if args['password']:
            user.password = args['password']
        db.session.commit()
        return user, 200

    @marshal_with(user_fields)
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        db.session.delete(user)
        db.session.commit()
        Users = User.query.all()
        return Users 



api.add_resource(users, '/users')
api.add_resource(user, '/users/<int:id>')


@app.route('/signup', methods=['GET' ,'POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email:
        return jsonify({'message': 'Username and email are required'}), 400

    # ✅ Hash the password properly here
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store as string in the DB
    new_user = User(username=username, email=email, password=hashed_password.decode('utf-8'))
    
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password") 

    user = User.query.filter((User.email == email) | (User.username == email)).first()

    hashed_password = user.password.encode('utf-8')  # Stored as str, convert to bytes

    if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
        return jsonify({'message': 'Login successful'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401



@app.route('/')
def home():
    return "<h1>Welcome to the Flask API!</h1>"


if __name__ == '__main__':
    app.run(debug=True)

