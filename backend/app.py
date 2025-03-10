import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import language_v1
from googleapiclient import discovery
from dotenv import load_dotenv
import joblib

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize Google Cloud NLP client
try:
    nlp_client = language_v1.LanguageServiceClient()
    logger.info("Google Cloud NLP client initialized.")
except Exception as e:
    logger.error("Error initializing Google Cloud NLP client: %s", e)
    raise

# Get Perspective API key from environment variables
PERSPECTIVE_API_KEY = os.getenv("PERSPECTIVE_API_KEY")
if not PERSPECTIVE_API_KEY:
    logger.error("PERSPECTIVE_API_KEY is not set in environment variables.")
    raise Exception("Missing PERSPECTIVE_API_KEY")

# Initialize Perspective API client
try:
    perspective_client = discovery.build("commentanalyzer", "v1alpha1", developerKey=PERSPECTIVE_API_KEY)
    logger.info("Perspective API client initialized.")
except Exception as e:
    logger.error("Error initializing Perspective API client: %s", e)
    raise

# Load meta-classifier (required for our fusion approach)
meta_classifier_path = os.getenv("META_CLASSIFIER_PATH")
if not meta_classifier_path:
    logger.error("META_CLASSIFIER_PATH is not set in environment variables. Please provide a path for your meta classifier.")
    raise Exception("Missing META_CLASSIFIER_PATH")
if not os.path.exists(meta_classifier_path):
    logger.error("Meta-classifier file not found at %s", meta_classifier_path)
    raise Exception("Meta-classifier file not found")
try:
    meta_classifier = joblib.load(meta_classifier_path)
    logger.info("Meta-classifier loaded from %s", meta_classifier_path)
except Exception as e:
    logger.error("Error loading meta-classifier: %s", e)
    raise

def analyze_sentiment(text):
    """Analyzes sentiment using Google Cloud NLP and returns a sentiment score."""
    document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
    response = nlp_client.analyze_sentiment(document=document)
    return response.document_sentiment.score  # Score ranges from -1 (negative) to 1 (positive)

def get_toxicity(text):
    """Uses Perspective API to obtain a toxicity score for the text."""
    analyze_request = {
        "comment": {"text": text},
        "requestedAttributes": {"TOXICITY": {}}
    }
    response = perspective_client.comments().analyze(body=analyze_request).execute()
    return response["attributeScores"]["TOXICITY"]["summaryScore"]["value"]

def fused_score(text):
    """
    Combines predictions from sentiment analysis and toxicity scoring.
    Uses a meta-classifier for improved accuracy.
    """
    try:
        sentiment = analyze_sentiment(text)
        toxicity = get_toxicity(text)
    except Exception as e:
        logger.error("Error during individual model analysis: %s", e)
        raise

    # Prepare features for the meta-classifier: [sentiment, toxicity]
    features = [[sentiment, toxicity]]
    try:
        prediction = meta_classifier.predict(features)[0]
        score = float(prediction)  # Assume meta-classifier outputs 0 (clean) or 1 (flagged)
        logger.info("Meta-classifier predicted score: %.2f", score)
    except Exception as e:
        logger.error("Error during meta-classifier prediction: %s", e)
        # Fallback to weighted average if meta-classifier fails
        score = 0.6 * (1 - sentiment) + 0.4 * toxicity
        logger.info("Fallback weighted average score: %.2f", score)
    return score

@app.route("/analyze", methods=["POST"])
def analyze():
    """Endpoint to analyze text for misinformation/hate speech."""
    try:
        data = request.get_json()
        text = data.get("text", "")
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Compute the combined score using the meta-classifier fusion approach
        score = fused_score(text)
        # Define a threshold for flagging (adjust as needed)
        threshold = 0.5
        label = "Hate/Misinformation Detected" if score > threshold else "Content is Clean"

        logger.info("Text analyzed. Score: %.2f, Label: %s", score, label)

        # Respond with detailed results
        return jsonify({
            "analysis": label,
            "score": score,
            "sentiment": analyze_sentiment(text),
            "toxicity": get_toxicity(text)
        })
    except Exception as e:
        logger.error("Error in /analyze endpoint: %s", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
