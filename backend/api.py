from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS
import bcrypt
import requests
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env.local")
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)
CORS(app)

TMDB_KEY = os.getenv('NEXT_PUBLIC_TMDB_API_KEY')

@app.route('/fetch_movies', methods=['GET', 'POST'])
def fetch_movies():
    try:
        # Ensure the request has JSON data
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Missing JSON payload'}), 400

        email = data.get("email")
        password = data.get("password") 

        # Check if both email and password were provided
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user by email or username
        user = User.query.filter((User.email == email) | (User.username == email)).first()
        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Compare provided password with stored hash
        hashed_password = user.password.encode('utf-8')  # Stored as string
        print(f"Hashed password from DB: {hashed_password}")
        if not bcrypt.checkpw(password.encode('utf-8'), hashed_password):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Fetch popular movies from TMDB
        uri = f'https://api.themoviedb.org/3/movie/popular?api_key={TMDB_KEY}&language=en-US&page=1'
        response = requests.get(uri, timeout=10)
        if response.status_code != 200:
            print(f"TMDB Error: {response.status_code}, {response.text}")
            return jsonify({'message': 'Failed to fetch movies from TMDB'}), 500

        data = response.json()
        movies = data.get('results', [])
        for movie in movies:
            try:
                title = movie['title']
                backdrop = f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path')}"
                year = movie.get('release_date', '')[:4]
                rating = movie.get('vote_average', 0)
                trailer = movie_trailer(movie['id']) or False
                description = movie.get('overview', False)
                image = f"https://image.tmdb.org/t/p/original{movie.get('poster_path')}"
                adult = movie.get('adult', False)

                new_movie = Movies(
                    title=title,
                    backdrop=backdrop,
                    year=year,
                    rating=rating,
                    trailer=trailer,
                    description=description,
                    image=image,
                    adult=adult
                )
                db.session.add(new_movie)
            except Exception as e:
                print(f"Error adding movie {movie.get('title')}: {e}")
            
        db.session.commit()
        return jsonify({'message': 'Movies fetched and saved successfully'}), 200
            

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({'message': 'Internal server error'}), 500


@app.route('/movies_id', methods=['POST'])
def movies_id():
    try:
        data = request.get_json()
        if not data or 'id' not in data:
            return jsonify({'message': 'Missing or invalid ID'}), 400

        movie_id = data['id']
        movie = Movies.query.filter_by(id=movie_id).first()
        if not movie:
            return jsonify({'message': 'Movie not found'}), 404

        return jsonify({
            'id': movie.id,
            'title': movie.title,
            'backdrop': movie.backdrop,
            'year': movie.year,
            'rating': movie.rating,
            'trailer': movie.trailer,
            'description': movie.description,
            'image': movie.image,
            'adult': movie.adult
        }), 200

    except Exception as e:
        print("Error in fetching movie by ID:", str(e))
        return jsonify({'message': 'Internal server error'}), 500



@app.route('/movie_search', methods=['POST'])
def movie_search():
    try:
        data = request.get_json()
        if not data or 'quary' not in data:
            print("y")
            return jsonify({'message': 'Missing or invalid query'}), 400

        searchedMovies = search_movies(data['quary'])
        print(searchedMovies)
        print("fuck off")
        return jsonify({'results': searchedMovies}), 200  # ✅ You must return a response

    except Exception as e:
        print("Error in searching movies:", str(e))
        return jsonify({'message': 'Internal server error'}), 500  # ✅ Also return on error

def search_movies(query):
    url = f'https://api.themoviedb.org/3/search/movie?api_key={TMDB_KEY}&query={query}'
    res = requests.get(url)
    data = res.json()
    movies = []
    for movie in data.get('results', []):
        movies.append({
            'id': movie['id'],
            'title': movie['title'],
            'backdrop': f"https://image.tmdb.org/t/p/original{movie.get('backdrop_path')}",
            'year': movie.get('release_date', '')[:4],
            'rating': movie.get('vote_average', 0),
            'trailer': movie_trailer(movie['id']) or 'Trailer not available',
            'description': movie.get('overview', 'No description available'),
            'image': f"https://image.tmdb.org/t/p/original{movie.get('poster_path')}",
            'adult': movie.get('adult', False)
        })
    return movies



def movie_trailer(movie_id):
    url = f'https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key={TMDB_KEY}&language=en-US'
    res = requests.get(url)
    data = res.json()
    for video in data.get('results', []):
        if video.get('type') == 'Trailer' and video.get('site') == 'YouTube':
            return f"https://www.youtube.com/watch?v={video['key']}"
    return None

class Watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('watchlist', lazy=True))
    movie = db.relationship('Movies', backref=db.backref('watchlisted_by', lazy=True))
    def __repr__(self):
        return f'<Watchlist {self.user_id} - {self.movie_id}>'


class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=False, nullable=False)
    backdrop = db.Column(db.String(120), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    trailer = db.Column(db.String(120), nullable=True)
    description = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(120), nullable=False)
    adult = db.Column(db.Boolean, nullable=False)
    
    def __repr__(self):
        return f'<Movie {self.title}>'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User = {self.username}> <email = {self.email}> '


user_args = reqparse.RequestParser()
user_args.add_argument('username', type=str,required=True, help='Username of the user')
user_args.add_argument('email', type=str, required=True, help='Email of the user')
user_args.add_argument('password', type=str, required=True, help='Password of the user')

movie_args = reqparse.RequestParser()
movie_args.add_argument('title', type=str, required=True, help='Title of the movie')
movie_args.add_argument('backdrop', type=str, required=True, help='Backdrop of the movie')
movie_args.add_argument('year', type=int, required=True, help='Year of the movie')
movie_args.add_argument('rating', type=float, required=True, help='Rating of the movie')
movie_args.add_argument('trailer', type=str, required=True, help='Trailer of the movie')
movie_args.add_argument('description', type=str, required=True, help='Description of the movie')
movie_args.add_argument('image', type=str, required=True, help='Image of the movie')
movie_args.add_argument('adult', type=bool, required=True, help='Adult flag (True/False)')

watchlist_args = reqparse.RequestParser()
watchlist_args.add_argument('user_id', type=int, required=True, help='User ID is required')
watchlist_args.add_argument('movie_id', type=int, required=True, help='Movie ID is required')

watchlist_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'movie_id': fields.Integer
}

movie_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'backdrop': fields.String,
    'year': fields.Integer,
    'rating': fields.Float,
    'trailer': fields.String,
    'description': fields.String,
    'image': fields.String,
    'adult': fields.Boolean
}

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password': fields.String,
}


class watchlist(Resource):
    @marshal_with(watchlist_fields)
    def get(self):
        watchlists = Watchlist.query.all()
        return watchlists

    @marshal_with(watchlist_fields)
    def post(self):
        args = watchlist_args.parse_args()
        new_watchlist = Watchlist(user_id=args['user_id'], movie_id=args['movie_id'])
        db.session.add(new_watchlist)
        db.session.commit()
        watchlists = Watchlist.query.all()
        return watchlists, 201

    @marshal_with(watchlist_fields)
    def delete(self, id):
        watchlist = Watchlist.query.filter_by(id=id).first()
        if not watchlist:
            abort(404, message="Watchlist not found")
        db.session.delete(watchlist)
        db.session.commit()
        watchlists = Watchlist.query.all()
        return watchlists, 200

class movies(Resource):
    @marshal_with(movie_fields)
    def get(self):
        movies = Movies.query.all()
        return movies
    @marshal_with(movie_fields)
    def delete(self):
        movies = Movies.query.all()
        for movie in movies:
            db.session.delete(movie)
        db.session.commit()
        return movies, 200
    
class movie(Resource):
    @marshal_with(movie_fields)
    def get(self, id):
        movie = Movies.query.filter_by(id=id).first()
        if not movie:
            abort(404, message="Movie not found")
        return movie

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


api.add_resource(movies, '/movies')
api.add_resource(movie, '/movies/<int:id>')
api.add_resource(watchlist, '/watchlist')
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
    if not user:
        return jsonify({'message': 'User not found'}), 404

    hashed_password = user.password.encode('utf-8')  # Stored as str, convert to bytes

    if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
        print("hello")
        if Movies.query.count() == 0:
            try:
                fetch_movies()
            except Exception as e:
                print(f"Error fetching movies: {e}")

        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401



@app.route('/')
def home():
    return "<h1>Welcome to the Flask API!</h1>"


if __name__ == '__main__':
    app.run(debug=True)