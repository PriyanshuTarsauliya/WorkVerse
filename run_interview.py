"""
WorkVerse & OpenInterview CLI Integration Script
Generates customized mock interview questions and audio using OpenAI (GPT) or Anthropic (Claude).
Optimized for token usage efficiency (iteration=1, max_sentence=5).
"""

import os
import sys
import argparse

# Add local 'open-interview' folder to Python path if present
open_interview_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "open-interview")
if os.path.exists(open_interview_dir) and open_interview_dir not in sys.path:
    sys.path.insert(0, open_interview_dir)

# Attempt to import openinterview
try:
    # pyrefly: ignore [missing-import]
    import openai
    # pyrefly: ignore [missing-import]
    from openinterview import InterviewManager, RandomPlayer
    OPENINTERVIEW_AVAILABLE = True
except ImportError:
    OPENINTERVIEW_AVAILABLE = False
    print("Notice: 'openinterview' or 'openai' package not installed in environment.")
    print("To install: pip install open-interview openai anthropic")

INTERVIEW_TYPES = [
    "generalQAs",
    "generalTechQAs",
    "techQAsFromResume",
    "techQAsFromExperts",
    "techQAs",
    "personalityQAs",
    "reviewResume"
]

def run_gpt_interview(api_key, jd, resume_path, position, interview_type, output_dir="save/dirs"):
    print(f"\n--- Generating Interview with GPT Engine ({interview_type}) ---")
    if not OPENINTERVIEW_AVAILABLE:
        print("[Simulation Mode] Generating interview structure for:", position)
        print(f"JD Snippet: {jd[:60]}...")
        print(f"Output Directory: {output_dir}")
        return

    openai.api_key = api_key
    gpt_manager = InterviewManager(api_key=openai.api_key, engine="GPT")
    
    gpt_manager.generate_interview(
        jd=jd,
        resume=resume_path,
        position=position,
        interview_type=interview_type,
        language="English",
        max_sentence=5,
        output_dir=output_dir,
        iteration=1  # Conservative token usage to avoid token exhaustion
    )
    print("✓ GPT Interview generated successfully in:", output_dir)

def run_claude_interview(claude_token, jd, resume_path, position, interview_type, output_dir="save/dirs"):
    print(f"\n--- Generating Interview with Claude Engine ({interview_type}) ---")
    if not OPENINTERVIEW_AVAILABLE:
        print("[Simulation Mode] Generating interview structure for:", position)
        return

    claude_manager = InterviewManager(api_key=claude_token, engine="Claude")
    claude_manager.generate_interview(
        jd=jd,
        resume=resume_path,
        position=position,
        interview_type=interview_type,
        language="English",
        max_sentence=5,
        output_dir=output_dir,
        iteration=1
    )
    print("✓ Claude Interview generated successfully in:", output_dir)

def play_audio_session(output_dir="save/dirs", interval=120):
    print(f"\n--- Launching OpenInterview Random Audio Player ({output_dir}) ---")
    if not OPENINTERVIEW_AVAILABLE:
        print("[Simulation] Playing question MP3s from:", output_dir)
        print("Press 'n' for next question, 'q' to quit.")
        return

    try:
        player = RandomPlayer(directory=output_dir, interval=interval)
        player.play_random_mp3()
    except Exception as e:
        print(f"Audio player error: {e}")

def main():
    parser = argparse.ArgumentParser(description="WorkVerse OpenInterview Tool")
    parser.add_argument("--engine", choices=["GPT", "Claude"], default="GPT", help="LLM Engine (GPT or Claude)")
    parser.add_argument("--type", choices=INTERVIEW_TYPES, default="techQAsFromResume", help="Interview QA type")
    parser.add_argument("--position", default="Senior Software Engineer", help="Target Job Title")
    parser.add_argument("--resume", default="resume.pdf", help="Path to resume file or text")
    parser.add_argument("--play", action="store_true", help="Launch RandomPlayer after generation")
    parser.add_argument("--outdir", default="save/dirs", help="Output directory for audio MP3 files")
    
    args = parser.parse_args()

    sample_jd = """
    Senior Software Engineer — High-Throughput Distributed Systems & Real-time WebSockets.
    Responsibilities: Build low-latency financial streaming applications, optimize React rendering pipelines, and manage distributed Kafka queues.
    """

    api_key = os.environ.get("OPENAI_API_KEY", "YOUR_OPENAI_API_KEY")
    claude_key = os.environ.get("ANTHROPIC_API_KEY", "YOUR_CLAUDE_API_KEY")

    if args.engine == "Claude":
        run_claude_interview(claude_key, sample_jd, args.resume, args.position, args.type, args.outdir)
    else:
        run_gpt_interview(api_key, sample_jd, args.resume, args.position, args.type, args.outdir)

    if args.play:
        play_audio_session(args.outdir)

if __name__ == "__main__":
    main()
