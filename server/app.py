from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for Vite's default port
CORS(app, origins=["http://localhost:5173"])


@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    POST route for calculations.
    Expects JSON data in the request body.
    """
    data = request.get_json()
    
    # TODO: Add calculation logic here
    
    return jsonify({
        "success": True,
        "message": "Calculation endpoint",
        "data": data
    })


if __name__ == '__main__':
    app.run(port=5000, debug=True)
