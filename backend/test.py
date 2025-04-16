import requests

data = {
    "username": "mouli__p",
    "password": "cmac1234$"
}

response = requests.post("https://api.example.com/login", json=data)

token = response.json().get("access_token")
print("Bearer", token)