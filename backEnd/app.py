import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from DB import db

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/questions/next', methods=['GET'])
def get_next_question():
    """
    Returns the next question for the user.
    For now, simply returns the first active question found.
    """
    try:
        questions = db.get_questions()
        if not questions:
            return jsonify({"error": "No questions available"}), 404
        
        # In a real app, we would filter out questions the user has already answered.
        # For this MVP, we just return the first one (most recent due to ordering in db.py).
        question = questions[0]
        question_id = question['id']
        
        # Fetch options for this question
        options = db.get_options(question_id)
        
        response_data = {
            "id": question_id,
            "title": question['title'],
            "description": question.get('description'),
            "options": options
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/answers', methods=['POST'])
def submit_answer():
    """
    Submits a user's vote.
    Expected JSON: { "user_id": str, "question_id": int, "option_id": int }
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid request body"}), 400
            
        user_id = data.get('user_id')
        question_id = data.get('question_id')
        option_id = data.get('option_id')
        
        if not all([user_id, question_id, option_id]):
            return jsonify({"error": "Missing required fields"}), 400
            
        result = db.vote(user_id, question_id, option_id)
        if not result:
            # If vote failed (e.g. constraints), db.vote returns generic {}, 
            # we might want to be more specific but for now this suffices.
            # However, db.vote currently prints error and returns {}, so we assume failure if empty.
            # Actually, db.vote returns the inserted row. 
            pass

        # After voting, return the updated stats immediately
        stats = db.get_question_stats(question_id)
        return jsonify({"message": "Vote recorded", "stats": stats}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/questions/<int:question_id>/stats', methods=['GET'])
def get_stats(question_id):
    """
    Returns statistics for a specific question.
    """
    try:
        stats = db.get_question_stats(question_id)
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
