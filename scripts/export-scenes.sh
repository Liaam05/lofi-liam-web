#!/usr/bin/env bash
# ============================================================
# export-scenes.sh
# anime-lofi の各話のループ動画(seamless*.mp4)を Web 用に軽量化して public/scenes/ へ書き出す。
#   動画: 1280x720 / H.264 / 無音 / faststart（ブラウザで途中から読み込める形）
#   静止画: scene*.png → poster の jpg（動画の読み込み前や「動きを減らす」設定のとき表示）
#
# 使い方:
#   ./scripts/export-scenes.sh            # 全話
#   ./scripts/export-scenes.sh ep11       # 名前に ep11 を含む話だけ
# ============================================================
set -euo pipefail
if ! command -v ffmpeg >/dev/null 2>&1 && [ -x /opt/homebrew/bin/ffmpeg ]; then
  export PATH="/opt/homebrew/bin:$PATH"
fi

SRC_DIR="${SRC_DIR:-$HOME/dev/anime-lofi/episodes}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/scenes"
FILTER="${1:-}"
mkdir -p "$OUT_DIR"

for ep in "$SRC_DIR"/*/; do
  name=$(basename "$ep")              # 例: ep01_rainy_study
  [[ -n "$FILTER" && "$name" != *"$FILTER"* ]] && continue
  for clip in "$ep"seamless*.mp4; do
    [ -e "$clip" ] || continue
    suffix=$(basename "$clip" .mp4 | sed 's/^seamless//')   # "" または "_a" など
    id="${name}${suffix}"
    png="${ep}scene${suffix}.png"

    echo "→ $id"
    ffmpeg -y -loglevel error -i "$clip" -an \
      -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30,format=yuv420p" \
      -c:v libx264 -preset slow -crf 26 -movflags +faststart "$OUT_DIR/$id.mp4"
    if [ -e "$png" ]; then
      ffmpeg -y -loglevel error -i "$png" -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" \
        -q:v 4 "$OUT_DIR/$id.jpg"
    fi
  done
done

echo "完成: $OUT_DIR ($(du -sh "$OUT_DIR" | cut -f1))"
ls -lh "$OUT_DIR" | awk 'NR>1{print "  "$5"\t"$9}'
