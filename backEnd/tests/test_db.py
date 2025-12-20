import os
import sys

# Add directory to path to allow import
sys.path.append(os.path.join(os.path.dirname(__file__), 'DB'))

try:
    from db import get_questions, get_question_stats, create_question
except ImportError as e:
    print(f"Error importing from db: {e}")
    sys.exit(1)

def main():
    print("Testing Supabase Integration...")
    
    # Check if keys are present
    if not os.environ.get("SUPABASE_URL") or not os.environ.get("SUPABASE_KEY"):
        print("WARNING: SUPABASE_URL or SUPABASE_KEY not found in environment variables.")
        print("Please set them before running this script.")
        # We continue to see if maybe they are set but not visible or if the user wants to see the failure.
    
    print("\n--- Fetching Questions ---")
    questions = get_questions()
    print(f"Found {len(questions)} questions.")
    for q in questions:
        print(f"ID: {q.get('id')}, Title: {q.get('title')}")
        
    if not questions:
        print("No questions found (or connection failed).")
        # Optional: Try creating one if none exist?
        # print("Creating a test question...")
        # create_question("Test Question", "This is a test", "test-slug")

if __name__ == "__main__":
    main()
