"""
Original score + sound design + final mix for the promo, synthesised from scratch
(no samples, no licensing), locked to the picture via public/audio/timeline.json.

  npx tsx scripts/export-timeline.ts   # refresh timing from the edit
  python scripts/score.py              # -> public/audio/master.wav (+ music/sfx stems)

Mix: music is ducked under every VO line, everything goes through a gentle bus
compressor + limiter, and the master is normalised to -14 LUFS (social/YouTube).
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, istft, sosfilt, stft

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"
VO_DIR = ROOT / "public" / "vo"
TL = json.loads((AUDIO / "timeline.json").read_text())

SR = 48000
FPS = TL["fps"]
DUR = TL["total"] / FPS + 0.2
N = int(DUR * SR)
M = TL["moments"]
rng = np.random.default_rng(7)

BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4


def fr(frame):
    return frame / FPS


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def buf():
    return np.zeros((N, 2))


def add(dst, sig, t, gain=1.0, pan=0.0):
    """Mix mono or stereo `sig` into dst at time t (s) with equal-power pan."""
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0:
        return
    if sig.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        sig = np.stack([sig * l * 1.414, sig * r * 1.414], axis=1)
    a, b = max(i, 0), min(i + len(sig), N)
    dst[a:b] += sig[a - i : b - i] * gain


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x, axis=0)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x, axis=0)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x, axis=0)


def env_adsr(n, a, d, s, r):
    t = np.arange(n) / SR
    total = n / SR
    e = np.where(t < a, t / max(a, 1e-4), 1.0)
    e = np.where((t >= a) & (t < a + d), 1 - (1 - s) * (t - a) / max(d, 1e-4), e)
    e = np.where(t >= a + d, s, e)
    rel = np.clip((total - t) / max(r, 1e-4), 0, 1)
    return e * rel


def reverb_ir(seconds=3.2, damp=5000, seed=1):
    g = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    decay = np.exp(-t * 6.9 / seconds)
    ir = g.standard_normal((n, 2)) * decay[:, None]
    ir = lp(ir, damp)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
    return ir / np.sqrt(np.sum(ir**2))


def reverb(x, ir, wet):
    out = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], axis=1)
    return x + out * wet


# ───────────────────────── instruments ─────────────────────────


def pad_voice(freq, dur, bright=1.0, seed=0):
    """Warm detuned saw stack (additive, band-limited), slow-breathing filter."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    g = np.random.default_rng(seed)
    out = np.zeros((n, 2))
    for ch in range(2):
        for det in (-7, 0, 7):
            f = freq * 2 ** ((det + g.uniform(-2, 2)) / 1200)
            ph = g.uniform(0, 2 * np.pi)
            for h in range(1, 14):
                if f * h > 9000:
                    break
                amp = (1 / h) * np.exp(-h / (3.0 + 4 * bright))
                out[:, ch] += amp * np.sin(2 * np.pi * f * h * t + ph * h)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + seed)
    out *= (0.75 + 0.25 * lfo)[:, None]
    return out / 6


def piano(freq, dur=3.5, vel=1.0):
    """Felt-piano-ish: inharmonic partials with per-partial decay + soft hammer."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    B = 0.0004
    for h in range(1, 10):
        fh = freq * h * np.sqrt(1 + B * h * h)
        if fh > 12000:
            break
        x += (0.9**h / h**0.6) * np.exp(-t * (1.1 + 0.9 * h)) * np.sin(2 * np.pi * fh * t)
    att = np.clip(t / 0.006, 0, 1)
    hammer = lp(rng.standard_normal(n) * np.exp(-t * 90), 2500) * 0.15
    return (x * att + hammer) * vel * 0.5


def pluck(freq, dur=0.6, vel=1.0, bright=3000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for h in range(1, 8):
        x += np.exp(-t * (6 + 5 * h)) * np.sin(2 * np.pi * freq * h * t) / h
    x = lp(x, bright)
    return x * np.clip(t / 0.003, 0, 1) * vel * 0.5


def bell(freq, dur=2.5, vel=1.0):
    """FM bell for sparkles and UI chimes."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 3.5 * t) * 2.2 * np.exp(-t * 3)
    return np.sin(2 * np.pi * freq * t + mod) * np.exp(-t * 2.4) * np.clip(t / 0.002, 0, 1) * vel * 0.35


def kick(vel=1.0):
    n = int(0.55 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32)
    ph = 2 * np.cumsum(np.pi * f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(n) * np.exp(-t * 400), 2000) * 0.25
    return np.tanh((body + click) * 1.6) * vel * 0.8


def clap(vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    e = sum(np.exp(-np.clip(t - d, 0, None) * 60) * (t >= d) for d in (0, 0.011, 0.023)) + 0.4 * np.exp(-t * 12)
    return bp(rng.standard_normal(n), 900, 5000) * e * vel * 0.3


def hat(vel=1.0, open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7500) * np.exp(-t * (14 if open_ else 70)) * vel * 0.18


def sub_boom(dur=2.8, f0=70, f1=32, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 2.2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(np.sin(ph) * np.exp(-t * 1.6) * 1.4) * vel * 0.9


def noise_sweep(dur, f_from, f_to, amp_curve, q=0.35, seed=3):
    """Band of noise whose centre glides from f_from to f_to (log), STFT-shaped."""
    g = np.random.default_rng(seed)
    n = int(dur * SR)
    x = g.standard_normal((n, 2))
    nper = 2048
    out = np.zeros_like(x)
    for c in range(2):
        f, tt, Z = stft(x[:, c], fs=SR, nperseg=nper)
        prog = np.clip(tt / dur, 0, 1)
        centre = f_from * (f_to / f_from) ** prog
        width = centre * q + 60
        gain = np.exp(-0.5 * ((f[:, None] - centre[None, :]) / width[None, :]) ** 2)
        gain *= amp_curve(prog)[None, :]
        _, y = istft(Z * gain, fs=SR, nperseg=nper)
        out[: min(n, len(y)), c] = y[:n]
    return out / (np.max(np.abs(out)) + 1e-9)


def whoosh(dur=0.9, up=True, vel=1.0, seed=5):
    curve = lambda p: np.sin(np.pi * np.clip(p, 0, 1)) ** 1.6
    a, b = (300, 6000) if up else (5000, 250)
    return noise_sweep(dur, a, b, curve, q=0.5, seed=seed) * vel * 0.45


def riser(dur=2.0, vel=1.0, seed=9):
    curve = lambda p: p**2.2
    noise = noise_sweep(dur, 400, 9000, curve, q=0.25, seed=seed)
    t = np.arange(len(noise)) / SR
    gl = np.zeros(len(noise))
    for k, base in enumerate((220, 330, 440)):
        f = base * 2 ** (2.0 * t / dur)
        gl += np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 2 / (k + 1)
    return (noise * 0.6 + gl[:, None] * 0.12) * vel


def reverse_swell(dur=1.0, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(rng.standard_normal((n, 2)), 3000)
    return x * ((t / dur) ** 3)[:, None] * vel * 0.4


def tick(vel=1.0, freq=2600):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) * 0.6 + hp(rng.standard_normal(n), 3000) * 0.5) * np.exp(-t * 260) * vel * 0.25


def key_click(vel=1.0):
    n = int(0.045 * SR)
    t = np.arange(n) / SR
    body = bp(rng.standard_normal(n), 1800, 6500) * np.exp(-t * 180)
    return body * vel * 0.16


# ───────────────────────── harmony ─────────────────────────

# D major world: Bm – G – D – A, resolving on a wide Dadd9 at the end card.
CHORDS = {
    "Bm": [47, 54, 59, 62, 66],
    "G": [43, 50, 55, 59, 62, 69],
    "D": [50, 57, 62, 66, 69],
    "A": [45, 52, 57, 61, 64],
    "Dadd9": [38, 50, 57, 62, 64, 66, 69, 76],
}
PROG = ["Bm", "G", "D", "A"]


def chord_at(bar):
    return PROG[int(bar) % 4]


# ───────────────────────── score ─────────────────────────

music = buf()
sfx = buf()

t_meet = fr(M["logoBurst"])
t_q = fr(TL["scenes"]["questions"]["from"])
t_build = fr(TL["scenes"]["build"]["from"])
t_honest = fr(TL["scenes"]["honest"]["from"])
t_roast = fr(TL["scenes"]["roast"]["from"])
t_wipe = fr(M["wipe"])
t_end = TL["total"] / FPS

# Pads: one chord per bar until the wipe, then the resolve rings out.
bar = 0
while bar * BAR < t_wipe:
    start = bar * BAR
    dur = min(BAR, t_wipe - start) + 1.6
    name = chord_at(bar)
    bright = 0.6 if start < t_meet else 1.0
    level = 0.3 if start < t_meet else 0.28
    if t_honest <= start < t_roast:
        level = 0.3
    for k, m in enumerate(CHORDS[name]):
        v = pad_voice(mtof(m), dur, bright=bright, seed=bar * 10 + k)
        v *= env_adsr(len(v), 0.9 if bar == 0 else 0.5, 0.2, 1.0, 1.4)[:, None]
        add(music, v, start, level / len(CHORDS[name]) * 2.2)
    bar += 1

res_dur = t_end - t_wipe + 0.2
for k, m in enumerate(CHORDS["Dadd9"]):
    v = pad_voice(mtof(m), res_dur, bright=1.3, seed=900 + k)
    v *= env_adsr(len(v), 0.08, 0.6, 0.85, 3.0)[:, None]
    add(music, v, t_wipe, 0.75 / len(CHORDS["Dadd9"]) * 2.2)
for k, m in enumerate([50, 57, 62, 66, 69, 74]):
    add(music, piano(mtof(m), 6.0, 0.7), t_wipe + 0.4 + k * 0.035, 0.32, pan=-0.3 + 0.12 * k)

# Intro piano motif — sparse, hopeful.
motif = [(0.9, 78, 0.8), (1.55, 74, 0.6), (2.2, 71, 0.55), (3.6, 79, 0.7), (4.3, 76, 0.5), (6.1, 78, 0.7), (6.8, 74, 0.5), (7.5, 81, 0.6)]
for tt, note, vel in motif:
    if tt < t_meet - 0.4:
        add(music, piano(mtof(note), 4.0, vel), tt, 0.5, pan=0.15)
        add(music, piano(mtof(note - 12), 4.0, vel * 0.5), tt, 0.35, pan=-0.15)

# Groove from the brand reveal through the roast (breakdown during "Nothing invented").
first_groove_bar = int(np.ceil(t_meet / BAR))
for b in range(first_groove_bar, int(t_wipe / BAR) + 1):
    bstart = b * BAR
    in_break = t_honest - 0.2 <= bstart < t_roast - 0.5
    energy = 1.25 if bstart >= t_roast - 0.5 else (1.1 if bstart >= t_build - 0.5 else 1.0)
    name = chord_at(b)
    tones = [m + 12 for m in CHORDS[name][1:4]] + [CHORDS[name][1] + 24]
    for step in range(16):
        st = bstart + step * BEAT / 4
        if st >= t_wipe - 0.05:
            break
        if not in_break:
            if step in (0, 8) or (energy > 1.2 and step in (0, 4, 8, 12)):
                add(music, kick(0.9 * energy), st, 0.55)
            if step in (4, 12):
                add(music, clap(0.8), st, 0.45, pan=0.05)
            if step % 2 == 1:
                add(music, hat(0.8 + 0.3 * (step % 4 == 2)), st, 0.5, pan=0.35)
            if step == 14:
                add(music, hat(0.6, open_=True), st, 0.4, pan=-0.3)
            # sidechained bass: 8ths ducking off the kick
            if step % 2 == 0:
                root = CHORDS[name][0] - 12 if CHORDS[name][0] > 40 else CHORDS[name][0]
                n = int(BEAT / 2 * SR)
                tb = np.arange(n) / SR
                bass = np.sin(2 * np.pi * mtof(root) * tb) + 0.3 * np.sin(4 * np.pi * mtof(root) * tb)
                bass *= np.clip(tb / 0.04, 0, 1) * np.clip((BEAT / 2 - tb) / 0.02, 0, 1)
                add(music, bass, st, 0.16 * energy)
        # arpeggio keeps running (softly) through the breakdown
        note = tones[(step * 3) % len(tones)]
        add(music, pluck(mtof(note), 0.5, 0.7 if step % 4 == 0 else 0.45), st, 0.22 * (0.6 if in_break else energy), pan=-0.4 + 0.8 * ((step % 4) / 3))

# Breakdown piano under "Nothing invented. Just your story…"
for k, (dt, note) in enumerate([(0.0, 74), (0.5, 78), (1.0, 81), (1.9, 83), (2.4, 81), (3.0, 78)]):
    add(music, piano(mtof(note), 3.5, 0.65), t_honest + 0.1 + dt, 0.45, pan=0.1)

ir = reverb_ir(3.4, 5200, 1)
music = reverb(music, ir, 0.32)
music = hp(music, 28)

# ───────────────────────── sound design ─────────────────────────

add(sfx, reverse_swell(1.6, 0.6), fr(M["pageRise"]) - 0.2 + 0.0, 0.35)
add(sfx, bell(mtof(86), 3.0, 0.5), fr(M["pageRise"]) + 1.3, 0.25, pan=0.4)  # caret glints on

# "No CV." slam
add(sfx, reverse_swell(0.7, 1.0), fr(M["noCvSlam"]) - 0.7, 0.6)
add(sfx, sub_boom(2.2, 80, 34, 0.9), fr(M["noCvSlam"]), 0.55)
add(sfx, lp(rng.standard_normal(int(0.4 * SR)) * np.exp(-np.arange(int(0.4 * SR)) / SR * 14), 1800), fr(M["noCvSlam"]), 0.25)

# question / answer whooshes
c = TL["cues"]
add(sfx, whoosh(0.8, True, 0.6, seed=11), fr(c["02b-noidea"]["from"]) - 0.35, 0.35, pan=-0.2)
add(sfx, whoosh(0.8, False, 0.6, seed=12), fr(c["02c-start"]["from"]) - 0.4, 0.35, pan=0.2)

# the click on "No CV yet"
add(sfx, whoosh(0.5, True, 0.4, seed=13), fr(M["clickNoCv"]) - 0.95, 0.2, pan=0.4)
add(sfx, tick(1.0, 1900), fr(M["clickNoCv"]), 0.9, pan=0.25)
add(sfx, bell(mtof(81), 1.6, 0.6), fr(M["clickNoCv"]) + 0.02, 0.35, pan=0.25)

# zoom-through riser → brand impact
add(sfx, riser(1.9, 1.0), t_meet - 1.9, 0.5)
add(sfx, sub_boom(3.2, 72, 30, 1.0), t_meet, 0.8)
add(sfx, hp(rng.standard_normal((int(2.5 * SR), 2)), 5000) * np.exp(-np.arange(int(2.5 * SR)) / SR * 2.2)[:, None], t_meet, 0.09)
for k, note in enumerate([81, 86, 88, 93]):
    add(sfx, bell(mtof(note), 2.6, 0.6), t_meet + 0.05 + k * 0.07, 0.22, pan=-0.5 + k * 0.33)
add(sfx, whoosh(0.7, True, 0.5, seed=14), fr(M["wordmark"]) - 0.1, 0.22)
add(sfx, tick(0.6, 3200), fr(M["builderLabel"]) + 0.2, 0.5)

# builder card lands, then typing + "Next" for every question
add(sfx, whoosh(0.9, False, 0.7, seed=15), fr(M["cardIn"]) - 0.25, 0.4)
add(sfx, sub_boom(0.9, 90, 45, 0.5), fr(M["cardIn"]) + 0.55, 0.3)
answers = [26, 59, 67, 48, 61]
for i, at in enumerate(M["questions"]):
    if i > 0:
        add(sfx, tick(0.9, 1500), fr(at - 8), 0.7, pan=0.3)  # "Next" press
        add(sfx, whoosh(0.45, True, 0.45, seed=20 + i), fr(at - 4), 0.25, pan=-0.3)
    t0 = fr(at + 8)
    for ch in range(answers[i]):
        if rng.random() < 0.85:
            add(sfx, key_click(0.6 + 0.4 * rng.random()), t0 + ch / (1.6 * FPS) + rng.uniform(-0.004, 0.004), 0.5, pan=rng.uniform(-0.2, 0.2))
add(sfx, tick(1.0, 1500), fr(M["questions"][-1]) + 1.75, 0.7, pan=0.3)  # "Build my CV"
add(sfx, bell(mtof(88), 2.0, 0.6), fr(M["questions"][-1]) + 1.78, 0.25)

# build: chips fly in, AI scan, "in seconds"
add(sfx, whoosh(0.8, False, 0.6, seed=31), t_build - 0.3, 0.3)
for k in range(5):
    add(sfx, whoosh(0.5, True, 0.5, seed=40 + k), fr(M["scanStart"] - 18 + k * 6), 0.18, pan=-0.6 + 0.3 * k)
scan_len = M["scanLen"] / FPS
scan = noise_sweep(scan_len + 0.4, 600, 7000, lambda p: np.sin(np.pi * np.clip(p, 0, 1)) ** 0.8, q=0.12, seed=50)
add(sfx, scan, fr(M["scanStart"]) - 0.1, 0.22)
for k in range(10):
    add(sfx, bell(mtof(84 + (k * 5) % 12), 1.4, 0.4), fr(M["scanStart"]) + k * scan_len / 10, 0.12, pan=rng.uniform(-0.6, 0.6))
add(sfx, sub_boom(1.6, 85, 38, 0.8), fr(M["inSeconds"]), 0.5)
add(sfx, bell(mtof(90), 2.4, 0.7), fr(M["inSeconds"]) + 0.2, 0.22, pan=0.3)

# honest: highlighter swipes
add(sfx, whoosh(0.8, False, 0.6, seed=61), t_honest - 0.3, 0.3)
for k in range(3):
    sw = noise_sweep(0.35, 2500, 5000, lambda p: np.sin(np.pi * np.clip(p, 0, 1)), q=0.6, seed=70 + k)
    add(sfx, sw, fr(M["marker"] + 6 + k * 9), 0.12, pan=-0.3 + 0.3 * k)

# roast: three punches + score counter
add(sfx, whoosh(0.8, True, 0.6, seed=81), t_roast - 0.35, 0.3)
for k, key in enumerate(("roast", "score", "sharpen")):
    add(sfx, sub_boom(0.8, 110, 50, 0.7), fr(M[key]), 0.45)
    add(sfx, clap(1.0), fr(M[key]), 0.35)
    add(sfx, bell(mtof(81 + 3 * k), 1.2, 0.5), fr(M[key]) + 0.01, 0.18, pan=-0.3 + 0.3 * k)
for k in range(0, 40, 2):
    add(sfx, tick(0.4 + 0.3 * (k / 40), 2200 + 30 * k), fr(M["score"] + k), 0.35, pan=-0.2)
add(sfx, whoosh(0.4, True, 0.5, seed=90), fr(M["sharpen"] + 8), 0.2)

# end card: wipe, badge pops, url shine
add(sfx, riser(1.4, 0.8, seed=91), t_wipe - 1.3, 0.38)
add(sfx, whoosh(1.0, True, 0.8, seed=92), t_wipe - 0.15, 0.35)
add(sfx, sub_boom(3.0, 70, 30, 1.0), t_wipe + 0.4, 0.7)
for k in range(3):
    add(sfx, bell(mtof(86 + [0, 2, 5][k]), 1.4, 0.6), fr(M["badges"] + k * 9), 0.22, pan=-0.4 + 0.4 * k)
    add(sfx, tick(0.7, 2800), fr(M["badges"] + k * 9), 0.4, pan=-0.4 + 0.4 * k)
add(sfx, whoosh(0.6, True, 0.5, seed=93), fr(M["url"]) - 0.9, 0.2)
for k, note in enumerate([86, 90, 93, 98]):
    add(sfx, bell(mtof(note), 3.0, 0.6), fr(M["url"]) + 0.12 + k * 0.06, 0.2, pan=-0.3 + 0.2 * k)

sfx = reverb(sfx, reverb_ir(2.2, 7000, 2), 0.22)

# ───────────────────────── VO + ducking + master ─────────────────────────

vo = buf()
duck = np.zeros(N)
for vid, cue in c.items():
    sr, data = wavfile.read(VO_DIR / f"{vid}.wav")
    assert sr == SR, (vid, sr)
    x = data.astype(np.float64) / 32768.0 if data.dtype == np.int16 else data.astype(np.float64)
    if x.ndim > 1:
        x = x.mean(axis=1)
    start = fr(cue["from"])
    add(vo, x, start, 1.0)
    a, b = int(start * SR), min(int(start * SR) + len(x), N)
    duck[a:b] = 1.0

# smooth the duck: ~120 ms attack (pre-roll), ~450 ms release
k_att, k_rel = int(0.12 * SR), int(0.45 * SR)
d = np.convolve(duck, np.ones(k_rel) / k_rel, mode="full")[:N]
d = np.maximum(d, np.concatenate([duck[k_att:], np.zeros(k_att)]))
d = np.clip(np.convolve(d, np.ones(k_att) / k_att, mode="same"), 0, 1)
music_gain = 1.0 - 0.58 * d  # about -7.5 dB under voice

# fade the whole bed in/out
fade = np.ones(N)
fi, fo = int(0.6 * SR), int(2.4 * SR)
fade[:fi] = np.linspace(0, 1, fi) ** 2
fade[-fo:] = np.linspace(1, 0, fo) ** 1.5

music *= (music_gain * fade)[:, None]
sfx *= fade[:, None]


def norm(x, peak=0.9):
    return x * (peak / (np.max(np.abs(x)) + 1e-9))


def write(path, x):
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


music_n = norm(music, 0.5)
sfx_n = norm(sfx, 0.5)
mix = music_n * 0.92 + sfx_n * 0.6 + vo * 1.0

# bus glue: soft-knee compression on the summed bed, then a clean limiter
def compress(x, thresh=0.35, ratio=2.5, att=0.005, rel=0.12):
    level = np.max(np.abs(x), axis=1)
    a_att, a_rel = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    env = np.zeros_like(level)
    e = 0.0
    for i in range(0, len(level), 32):  # block-wise envelope for speed
        v = level[i : i + 32].max()
        coef = a_att if v > e else a_rel ** 32
        e = coef * e + (1 - coef) * v
        env[i : i + 32] = e
    gain = np.where(env > thresh, (thresh + (env - thresh) / ratio) / (env + 1e-9), 1.0)
    return x * gain[:, None]


mix = compress(mix)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)

AUDIO.mkdir(parents=True, exist_ok=True)
write(AUDIO / "music.wav", music_n)
write(AUDIO / "sfx.wav", sfx_n)
pre = AUDIO / "_premaster.wav"
write(pre, norm(mix, 0.95))

# loudness-normalise the master to -14 LUFS, -1 dBTP
subprocess.run(
    ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(pre), "-af", "loudnorm=I=-14:TP=-1.0:LRA=9", "-ar", str(SR), str(AUDIO / "master.wav")],
    check=True,
)
pre.unlink()
print(f"master.wav  {DUR:.2f}s")
