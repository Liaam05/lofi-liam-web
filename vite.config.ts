import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パスで出力 → GitHub Pages の /lofi-liam-web/ 配下でもそのまま動く
  base: './',
})
