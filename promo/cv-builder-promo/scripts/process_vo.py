"""
Polishes the raw tts.ai clips into broadcast-ready VO stems.

  public/vo/<id>.mp3  ->  public/vo/<id>.wav (48 kHz, trimmed, EQ'd, compressed, -16 LUFS)

Also writes public/vo/vo.json: {id: {"dur": seconds, "phrases": [[start, end], ...]}}
where phrases are the spoken stretches between pauses, used to sync on-screen beats.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VO = ROOT / "public" / "vo"
LINES = json.loads((ROOT / "scripts" / "vo-lines.json").read_text())["lines"]

CHAIN = ",".join([
    # trim leading/trailing silence, keep a short natural tail
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02",
    "areverse",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12",
    "areverse",
    "aresample=48000:resampler=soxr",
    "highpass=f=85",
    "equalizer=f=220:t=q:w=1.2:g=-1.5",   # less boxiness
    "equalizer=f=3200:t=q:w=1.0:g=2.0",   # presence
    "highshelf=f=9000:g=1.5",             # air
    "acompressor=threshold=-20dB:ratio=3:attack=8:release=120:makeup=2",
    "loudnorm=I=-16:TP=-1.5:LRA=7",
    "aresample=48000",
])


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).stdout
    return float(out.strip())


def phrases(path, dur):
    err = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "silencedetect=n=-40dB:d=0.12", "-f", "null", "-"]).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    segs, cursor = [], 0.0
    for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends))):
        if s - cursor > 0.05:
            segs.append([round(cursor, 3), round(s, 3)])
        cursor = e
    if dur - cursor > 0.05:
        segs.append([round(cursor, 3), round(dur, 3)])
    return segs


def main():
    meta = {}
    for line in LINES:
        src, dst = VO / f"{line['id']}.mp3", VO / f"{line['id']}.wav"
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(src), "-af", CHAIN, "-ac", "1", str(dst)])
        d = duration(dst)
        meta[line["id"]] = {"dur": round(d, 3), "phrases": phrases(dst, d)}
        print(f"{line['id']:<12} {d:5.2f}s  {meta[line['id']]['phrases']}")
    (VO / "vo.json").write_text(json.dumps(meta, indent=2) + "\n")


if __name__ == "__main__":
    main()
