import subprocess
import json

def extract_movie_details(filepath):
    try:
        # Use ffprobe to get media info in JSON format
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "quiet",
                "-print_format",
                "json",
                "-show_format",
                "-show_streams",
                filepath,
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        # Parse the JSON output
        media_info = json.loads(result.stdout.decode("utf-8"))

        # Extract movie details
        movie_stream = next(
            (stream for stream in media_info["streams"] if stream["codec_type"] == "video"),
            None,
        )

        name = media_info["format"]["filename"].split("/")[-1]
        year = None  # You can add logic to extract year from the filename or other metadata
        runtime = int(float(movie_stream["duration"]))

        return name, year, runtime

    except Exception as e:
        print(f"Error extracting movie details: {e}")
        return None, None, None
