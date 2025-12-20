import os
from supabase import create_client, Client
from typing import List, Dict, Any, Optional

# Initialize Supabase client
# Ensure SUPABASE_URL and SUPABASE_KEY are set in your environment variables
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# Initialize client only if keys are present to avoid immediate errors on import if not set
supabase: Optional[Client] = None
if url and key:
    supabase = create_client(url, key)

def _get_client() -> Client:
    if not supabase:
        raise ValueError("Supabase client not initialized. Check SUPABASE_URL and SUPABASE_KEY.")
    return supabase

# --- Users ---

def create_user() -> Dict[str, Any]:
    """
    Creates a new user in the 'users' table. 
    Returns the user object (including 'id').
    """
    try:
        response = _get_client().table("users").insert({}).execute()
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"Error creating user: {e}")
        return {}

# --- Questions ---

def get_questions() -> List[Dict[str, Any]]:
    """
    Fetch all active questions from the 'questions' table.
    """
    try:
        response = _get_client().table("questions").select("*").eq("is_active", True).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching questions: {e}")
        return []

def create_question(title: str, description: str = None, slug: str = None) -> Dict[str, Any]:
    """
    Insert a new question into the 'questions' table.
    """
    try:
        data = {"title": title}
        if description:
            data["description"] = description
        if slug:
            data["slug"] = slug
            
        response = _get_client().table("questions").insert(data).execute()
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"Error creating question: {e}")
        return {}

# --- Options ---

def get_options(question_id: int) -> List[Dict[str, Any]]:
    """
    Fetch all options for a specific question.
    """
    try:
        response = _get_client().table("options").select("*").eq("question_id", question_id).order("sort_order").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching options: {e}")
        return []

def add_option(question_id: int, label: str, image_url: str, sort_order: int = 0) -> Dict[str, Any]:
    """
    Insert a new option for a question.
    """
    try:
        data = {
            "question_id": question_id,
            "label": label,
            "image_url": image_url,
            "sort_order": sort_order
        }
        response = _get_client().table("options").insert(data).execute()
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"Error adding option: {e}")
        return {}

# --- Votes ---

def vote(user_id: str, question_id: int, option_id: int) -> Dict[str, Any]:
    """
    Cast a vote for a user on a specific question option.
    Uses UPSERT behaviour implicitly by handling uniqueness constraints or we can try simple insert.
    The schema has 'unique_user_question', so inserting again will fail unless we handle it.
    For now, we'll try to insert (single vote per question).
    """
    try:
        data = {
            "user_id": user_id,
            "question_id": question_id,
            "option_id": option_id
        }
        # If we want to allow changing votes:
        # response = _get_client().table("votes").upsert(data, on_conflict="user_id, question_id").execute()
        # But standard insert might be safer if we want to enforce one-time or catch errors manually.
        # Let's use upsert to allow changing mind.
        response = _get_client().table("votes").upsert(data, on_conflict="user_id, question_id").execute()
        
        if response.data:
            return response.data[0]
        return {}
    except Exception as e:
        print(f"Error voting: {e}")
        return {}

# --- Stats ---

def get_question_stats(question_id: int) -> List[Dict[str, Any]]:
    """
    Fetch statistics for a question from the 'question_option_stats' view.
    """
    try:
        response = _get_client().table("question_option_stats").select("*").eq("question_id", question_id).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching stats: {e}")
        return []
