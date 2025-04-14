from api import app, db

with app.app_context():
    db.create_all()
    print("Database created and tables initialized.")