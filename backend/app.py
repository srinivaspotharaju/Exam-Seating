from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from config import connect_db
from models.seating_model import SeatingArrangement
from algorithm.graphcoloring import generate_seating_arrangement

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])  # Enable CORS for frontend-backend communication
# Connect to MongoDB
db = connect_db()
seating_collection = db["seating_arrangement"]

print(db,seating_collection)




# ✅ Root Route to Avoid 404
@app.route('/')
def home():
    return "Seating Arrangement API is running!", 200



# ✅ Handle Favicon Request to Avoid 404
@app.route('/favicon.ico')
def serve_favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')





@app.route('/api/generate-seating', methods=['POST'])
def generate_seating():



    data = request.json  # Receive room, branches, and roll number details from frontend
    
    room = data.get("room")
    branches = data.get("branches")
    roll_numbers = data.get("roll_numbers")  # Dictionary { "CSE": [start, end], "ECE": [start, end] }

    if not room or not branches or not roll_numbers:
        return jsonify({"error": "Missing required fields"}), 400
    

    # -------------------------------------------------------------------------------------------------------------------------


    # Generate seating arrangement using the Graph Coloring Algorithm
    seating_plan = generate_seating_arrangement(room, branches, roll_numbers)

    # Save the result in the database
    seating_collection.insert_one({
        "room": room,
        "seating_plan": seating_plan
    })

    return jsonify({"message": "Seating arrangement generated successfully!", "seating_plan": seating_plan}), 200




@app.route('/api/get-seating/<room>', methods=['GET'])
def get_seating(room):
    result = seating_collection.find_one({"room": room}, {"_id": 0})
    if result:
        return jsonify(result)
    return jsonify({"error": "No seating arrangement found for this room"}), 404





if __name__ == '__main__':
    app.run(debug=True)
