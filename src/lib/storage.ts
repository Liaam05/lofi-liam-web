// localStorage の読み書き。プライベートブラウズ等では例外が出ることがあるので必ず try/catch で包む。
const PREFIX = 'lofi-liam:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // 保存できなくてもアプリは動かす
  }
}
