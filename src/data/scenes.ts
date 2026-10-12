// 背景に使う情景の一覧。動画と静止画は scripts/export-scenes.sh で public/scenes/ に書き出したもの。
// youtubeId = その情景の本編（公開済みのもの）。未公開・不明なら null（音楽カードはチャンネルへのリンクになる）。

export type Scene = {
  id: string
  title: string
  youtubeId: string | null
}

export const scenes: Scene[] = [
  { id: 'ep01_rainy_study', title: '雨の夜の勉強部屋', youtubeId: '-tuSvh_7JMA' },
  { id: 'ep02_snowy_cafe', title: '雪の日のカフェ', youtubeId: 'DMUC_ZFGdYY' },
  { id: 'ep03_mountain_cabin', title: '雪山の山小屋', youtubeId: '_2TztwSMGGU' },
  { id: 'ep04_autumn_library', title: '秋の図書室', youtubeId: 'zEbbHleLyXk' },
  { id: 'ep05_nature_reading', title: '大自然と読書', youtubeId: 'puSoguK7So0' },
  { id: 'ep06_sunset_train', title: '夕暮れの電車', youtubeId: 'XMRgImGbvU0' },
  { id: 'ep07_neon_night_room', title: '深夜のネオン街の部屋', youtubeId: null },
  { id: 'ep08_classical_study', title: 'クラシックな書斎', youtubeId: null },
  { id: 'ep09_starry_night_room', title: '星空の部屋', youtubeId: null },
  { id: 'ep10_holiday_room_day_a', title: '休日の部屋（昼）', youtubeId: null },
  { id: 'ep10_holiday_room_day_b', title: '休日の部屋（夕方）', youtubeId: null },
  { id: 'ep10_holiday_room_day_c', title: '休日の部屋（夜）', youtubeId: null },
  { id: 'ep11_rain_sounds', title: '秋の縁側の雨音', youtubeId: null },
  { id: 'ep12_autumn_sunset_room', title: '秋の夕暮れの部屋', youtubeId: null },
  { id: 'ep13_halloween_night_room', title: 'ハロウィンの夜の部屋', youtubeId: null },
]

// import.meta.env.BASE_URL = 公開先のパス（GitHub Pages では "/lofi-liam-web/"）
const base = import.meta.env.BASE_URL
export const videoSrc = (s: Scene) => `${base}scenes/${s.id}.mp4`
export const posterSrc = (s: Scene) => `${base}scenes/${s.id}.jpg`
