# Turn 3D — Figma Plugin

> Procedural 3D text generator for Figma, built with TypeScript + React.

Buat teks 3D yang memukau langsung di Figma — dengan berbagai style preset, kontrol arah depth, dan mode edit untuk mengubah hasil yang sudah ada.

---

## ✨ Fitur

### 🎨 Simple Mode
Mode cepat dengan kontrol intuitif:

| Fitur | Deskripsi |
|-------|-----------|
| **6 Style Presets** | Classic · Neon · Metallic · Comic · Retro · Candy |
| **5 Arah 3D** | Down-Right · Down · Down-Left · Right · Left |
| **Color Hue Slider** | 0–360° dengan preview swatches real-time |
| **Depth Layers** | 5–50 layer (kontrol ketebalan 3D) |

#### Style Presets
- 🔵 **Classic** — Blue depth, gaya default elegan
- 💚 **Neon** — Electric green/cyan dengan glow terang
- ⚙️ **Metallic** — Gradasi gold & silver realistis
- 💥 **Comic** — Bold outline tebal, warna solid mencolok
- 🎞️ **Retro** — Nuansa vintage hangat kecoklatan
- 🍬 **Candy** — Pastel pink/lavender dengan soft glow

### 🎛️ Advanced Mode
Kontrol penuh atas setiap elemen:
- **Body Settings** — Depth layers, offset X/Y, color ramp (start & end color)
- **Highlight (Top Layer)** — Stroke color, stroke width
- **Shadow Settings** — Jumlah layer shadow, max blur
- **Glow Effect** — Enable/disable, intensity, blur radius

### ✏️ Edit Mode
Pilih grup 3D yang sudah digenerate → buka plugin → setting ter-load otomatis → tombol berubah jadi **🔄 Update 3D Text**. Tidak perlu generate ulang dari nol!

### 💾 Preset Manager
Simpan dan load konfigurasi favorit kamu kapan saja.

---

## 🚀 Getting Started

### 1. Install Node.js
Download Node.js (sudah termasuk NPM):
👉 https://nodejs.org/en/download/

### 2. Install Dependencies
```bash
cd "turn 3D"
npm install
```

### 3. Build Plugin
```bash
# Production build (untuk digunakan di Figma)
npm run build

# Development build dengan watch mode (auto-rebuild saat file berubah)
npm run dev
```

### 4. Load ke Figma
1. Buka **Figma Desktop**
2. Klik **Menu → Plugins → Development → Import plugin from manifest...**
3. Pilih file `manifest.json` di folder ini
4. Plugin siap digunakan dari **Plugins → Development → Turn 3D**

---

## 📖 Cara Penggunaan

### Generate Teks Baru
1. Buka plugin di Figma
2. Pilih mode: **✨ Simple** atau **🎛️ Advanced**
3. Ketik teks yang ingin di-render
4. Atur font size & font weight
5. Pilih style preset dan arah 3D (Simple Mode)
6. Klik **🚀 Generate 3D Text**

### Edit Teks yang Sudah Ada
1. **Select** grup 3D yang sudah digenerate di canvas
2. Buka plugin — akan muncul banner **✏️ Edit Mode**
3. Ubah parameter sesuai keinginan
4. Klik **🔄 Update 3D Text**

---

## 🗂️ Struktur Project

```
turn 3D/
├── src/
│   ├── plugin/
│   │   ├── controller.ts      # Main plugin controller & message handler
│   │   ├── generator.ts       # Logika generasi 3D text + style presets
│   │   ├── detector.ts        # Deteksi selection (plugin-generated vs manual)
│   │   ├── colorUtils.ts      # Utilitas warna (HSL, RGB, interpolasi)
│   │   └── types.ts           # Type definitions (Text3DConfig, Preset, dll)
│   └── ui/
│       ├── app.tsx            # Main React app
│       ├── ui.tsx             # React entry point
│       ├── ui.html            # HTML template
│       ├── components/
│       │   ├── SimpleMode.tsx     # UI Simple Mode (presets + direction)
│       │   ├── AdvancedMode.tsx   # UI Advanced Mode
│       │   ├── PresetManager.tsx  # Simpan/load preset
│       │   └── Slider.tsx         # Reusable slider component
│       └── hooks/
│           └── usePluginState.ts  # Custom hook untuk state management
├── dist/                      # Build output (generated, don't edit)
│   ├── code.js
│   ├── ui.js
│   └── index.html
├── manifest.json              # Figma plugin manifest
├── webpack.config.js          # Webpack bundler config
├── tsconfig.json              # TypeScript config
└── package.json
```

---

## 🔧 Troubleshooting

### Plugin tidak muncul di Figma
- Pastikan sudah run `npm run build` terlebih dahulu
- Cek folder `dist/` — harus ada `code.js`, `ui.js`, `index.html`
- Reload plugin: **Plugins → Development → Turn 3D → Reload**

### Error "Font not found"
- Plugin akan otomatis load font yang dipilih
- Gunakan font yang tersedia di Figma (Inter, Roboto, dll)
- Font weight **Bold** / **ExtraBold** paling cocok untuk efek 3D

### Type errors saat build
- Jalankan `npm install` untuk memastikan semua dependencies terinstall
- Pastikan menggunakan Node.js versi 16+

---

## 🛠️ Tech Stack

- **TypeScript** — Type-safe development
- **React 18** — UI components
- **Webpack 5** — Module bundler
- **Figma Plugin API** — Canvas manipulation
- `@figma/plugin-typings` — Figma API type definitions

---

## 📄 License

MIT — bebas digunakan dan dimodifikasi.
