# Lofi Liam 作業用Webアプリ

Lofi Liam の情景ループを背景に、ポモドーロタイマーと本編BGM（YouTube埋め込み）を使える作業用ページ。

## 使い方（開発）
```
npm run dev       # http://localhost:5173 で確認（保存すると自動で反映）
npm run build     # 本番用に dist/ へ書き出し（型チェック込み）
npm run preview   # 書き出したものを確認
npm run lint      # コードの書き方チェック
```

## フォルダ構成
```
src/
├─ App.tsx                  画面全体の組み立て
├─ components/              画面の部品
│   ├─ SceneBackground.tsx  背景のループ動画（動きを減らす設定なら静止画）
│   ├─ Header.tsx           ロゴ・情景切替・YouTubeリンク
│   ├─ PomodoroTimer.tsx    タイマーの見た目
│   └─ MusicPlayer.tsx      YouTube 埋め込み（今の情景の本編）
├─ hooks/
│   ├─ useTimer.ts          タイマーのロジック（終わる時刻から残りを計算するのでズレない）
│   └─ usePersistentState.ts  useState＋localStorage保存
├─ lib/
│   ├─ audio.ts             タイマー終了のチャイム
│   └─ storage.ts           localStorage を安全に読み書き
└─ data/
    ├─ scenes.ts            情景の一覧（★新しい回はここに1行追加）
    └─ links.ts             YouTube チャンネルのURL
public/
└─ scenes/                  情景の動画(.mp4)と静止画(.jpg)  ← export-scenes.sh が作る
scripts/export-scenes.sh    anime-lofi の各話 → public/scenes/ に軽量化して書き出し
```

## 新しい回を追加する
1. `./scripts/export-scenes.sh ep11`（anime-lofi/episodes/ep11_* を書き出し）
2. `src/data/scenes.ts` に `{ id: 'ep11_xxx', title: '…', youtubeId: '動画ID' }` を追加
3. YouTube Studio でその動画の「埋め込みを許可」がオンか確認

## 公開
GitHub Pages。`main` に push すると `.github/workflows/deploy.yml` が自動でビルド＆公開する。
初回のみ GitHub のリポジトリ設定 → Pages → Source を「GitHub Actions」にする。
