#!/usr/bin/env python3
import argparse
import json
import sys
from faster_whisper import WhisperModel


def parse_args():
    parser = argparse.ArgumentParser(description="Transcribe audio with faster-whisper.")
    parser.add_argument("audio_path", help="Path to the audio file to transcribe.")
    parser.add_argument("--model", default="base", help="Faster Whisper model name to use.")
    parser.add_argument("--device", default="cpu", help="Device to run inference on.")
    parser.add_argument("--compute_type", default="int8", help="Compute type for faster-whisper.")
    return parser.parse_args()


def main():
    args = parse_args()

    model = WhisperModel(
        args.model,
        device=args.device,
        compute_type=args.compute_type,
    )

    segments, _ = model.transcribe(
        args.audio_path,
        beam_size=5,
        vad_filter=True,
    )

    transcript = " ".join(segment.text.strip() for segment in segments if segment.text)
    output = {"transcript": transcript}
    sys.stdout.write(json.dumps(output))


if __name__ == "__main__":
    main()
