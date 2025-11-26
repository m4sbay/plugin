# Analisis Kode Alert Banner Creator

## 1. Struktur HTML yang Dihasilkan

Berdasarkan fungsi `generateCode()` pada baris 302-359, struktur HTML yang dihasilkan adalah:

```html
<div role="alert" class="[CLASSES]">
  <svg class="[ICON_CLASSES]">
    <!-- Icon SVG sesuai alert type -->
  </svg>
  <div class="space-y-1">
    <div class="font-semibold [TITLE_CLASSES]">[TITLE]</div>
    <p class="[MESSAGE_CLASSES]">[MESSAGE]</p>
  </div>
</div>
```

### Tag HTML yang Digunakan:

1. **`<div>`** - Container utama alert banner
2. **`<svg>`** - Icon alert (information/success/error)
3. **`<div>`** - Container untuk konten teks (title dan message)
4. **`<div>`** - Container untuk title
5. **`<p>`** - Paragraf untuk message

---

## 2. Mapping Input User ke Class Tailwind

### 2.1. Style Statis (Basic Settings)

| Input User                 | State Variable    | Class Tailwind yang Dihasilkan                        | Default Value                                                           |
| -------------------------- | ----------------- | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| **Jenis Alert**            | `alertType`       | Mempengaruhi default colors (bg, border, text)        | `"information"`                                                         |
| **Judul Alert**            | `title`           | Konten teks (bukan class)                             | `"Information"`                                                         |
| **Pesan Alert**            | `message`         | Konten teks (bukan class)                             | `"This is an informational alert..."`                                   |
| **Border Radius (px)**     | `borderRadius`    | `rounded-[{value}px]` atau `rounded-md`               | `"6"` → `rounded-[6px]`                                                 |
| **Border Width (px)**      | `borderWidth`     | `border-[{value}px]` atau `border`                    | `"1"` → `border-[1px]`                                                  |
| **Warna Border**           | `borderColor`     | `border-[{color}]` atau default berdasarkan alertType | `""` (default: `border-blue-200`, `border-green-200`, `border-red-200`) |
| **Warna Background**       | `bgColor`         | `bg-[{color}]` atau default berdasarkan alertType     | `""` (default: `bg-blue-50`, `bg-green-50`, `bg-red-50`)                |
| **Warna Judul**            | `titleColor`      | `text-[{color}]` atau default berdasarkan alertType   | `""` (default: `text-blue-900`, `text-green-900`, `text-red-900`)       |
| **Ukuran Font Judul (px)** | `titleFontSize`   | `text-[{value}px]` atau `text-sm`                     | `"14"` → `text-[14px]`                                                  |
| **Warna Pesan**            | `messageColor`    | `text-[{color}]` atau default berdasarkan alertType   | `""` (default: `text-blue-800`, `text-green-800`, `text-red-800`)       |
| **Ukuran Font Pesan (px)** | `messageFontSize` | `text-[{value}px]` atau `text-sm`                     | `"14"` → `text-[14px]`                                                  |
| **Padding (px)**           | `padding`         | `p-[{value}px]` atau `p-4`                            | `"16"` → `p-[16px]`                                                     |
| **Lebar (px)**             | `width`           | `w-[{value}px]` atau `""` (kosong)                    | `""`                                                                    |
| **Tinggi (px)**            | `height`          | `h-[{value}px]` atau `""` (kosong)                    | `""`                                                                    |
| **Icon Size (px)**         | `iconSize`        | `h-[{value}px] w-[{value}px]` atau `h-4 w-4`          | `"16"` → `h-[16px] w-[16px]`                                            |

### 2.2. Style Dinamis (Dynamic Styles)

| Input User                | State Variable     | Class Tailwind yang Dihasilkan               | Default Value                                  |
| ------------------------- | ------------------ | -------------------------------------------- | ---------------------------------------------- |
| **Hover Background**      | `hoverBgColor`     | `hover:bg-[{color}]` (jika diisi)            | `""`                                           |
| **Hover Border**          | `hoverBorderColor` | `hover:border-[{color}]` (jika diisi)        | `""`                                           |
| **Focus Ring Width (px)** | `focusRingWidth`   | `focus:outline-[{value}px]` (jika diisi)     | `"2"` → `focus:outline-[2px]`                  |
| **Focus Ring Color**      | `focusRingColor`   | `focus:outline-[{color}]` (jika diisi)       | `"#3B82F6"` → `focus:outline-[#3B82F6]`        |
| **Tipe Transisi**         | `transitionType`   | `transition-all duration-[{ms}ms]` atau `""` | `"normal"` → `transition-all duration-[300ms]` |

---

## 3. Class Default Berdasarkan Alert Type

### 3.1. Information (Default)

```javascript
{
  border: "border-blue-200",      // Border warna biru muda
  bg: "bg-blue-50",                // Background warna biru sangat muda
  iconColor: "text-blue-600",     // Icon warna biru sedang
  titleColor: "text-blue-900",    // Title warna biru gelap
  messageColor: "text-blue-800"   // Message warna biru agak gelap
}
```

### 3.2. Success

```javascript
{
  border: "border-green-200",     // Border warna hijau muda
  bg: "bg-green-50",               // Background warna hijau sangat muda
  iconColor: "text-green-600",     // Icon warna hijau sedang
  titleColor: "text-green-900",    // Title warna hijau gelap
  messageColor: "text-green-800"   // Message warna hijau agak gelap
}
```

### 3.3. Error

```javascript
{
  border: "border-red-200",        // Border warna merah muda
  bg: "bg-red-50",                 // Background warna merah sangat muda
  iconColor: "text-red-600",       // Icon warna merah sedang
  titleColor: "text-red-900",      // Title warna merah gelap
  messageColor: "text-red-800"     // Message warna merah agak gelap
}
```

---

## 4. Penjelasan Tujuan Setiap Class Tailwind

### 4.1. Layout & Positioning Classes

#### Container Utama (`<div role="alert">`)

| Class                                  | Tujuan             | Penjelasan                                                                 |
| -------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| `flex`                                 | Layout flexbox     | Mengatur elemen dalam satu baris (icon dan konten)                         |
| `items-start`                          | Alignment vertikal | Menyelaraskan item ke atas (penting untuk icon yang lebih kecil dari teks) |
| `gap-3`                                | Spacing antar item | Memberikan jarak 12px (0.75rem) antara icon dan konten                     |
| `rounded-[{value}px]` / `rounded-md`   | Border radius      | Membuat sudut melengkung pada alert banner                                 |
| `border` / `border-[{value}px]`        | Border width       | Menentukan ketebalan border (default: 1px)                                 |
| `border-[{color}]` / `border-blue-200` | Border color       | Warna border (default berdasarkan alert type)                              |
| `bg-[{color}]` / `bg-blue-50`          | Background color   | Warna latar belakang (default berdasarkan alert type)                      |
| `p-[{value}px]` / `p-4`                | Padding            | Ruang dalam dari border ke konten (default: 16px)                          |
| `w-[{value}px]`                        | Width              | Lebar custom (jika dikosongkan, width akan auto)                           |
| `h-[{value}px]`                        | Height             | Tinggi custom (jika dikosongkan, height akan auto)                         |

#### Container Konten (`<div class="space-y-1">`)

| Class       | Tujuan           | Penjelasan                                                       |
| ----------- | ---------------- | ---------------------------------------------------------------- |
| `space-y-1` | Vertical spacing | Memberikan jarak vertikal 4px (0.25rem) antara title dan message |

### 4.2. Typography Classes

#### Title (`<div class="font-semibold ...">`)

| Class                              | Tujuan      | Penjelasan                                                          |
| ---------------------------------- | ----------- | ------------------------------------------------------------------- |
| `font-semibold`                    | Font weight | Membuat teks lebih tebal (font-weight: 600) untuk menonjolkan judul |
| `text-[{value}px]` / `text-sm`     | Font size   | Ukuran font custom atau default 14px                                |
| `text-[{color}]` / `text-blue-900` | Text color  | Warna teks (default berdasarkan alert type)                         |

#### Message (`<p class="...">`)

| Class                              | Tujuan     | Penjelasan                                  |
| ---------------------------------- | ---------- | ------------------------------------------- |
| `text-[{value}px]` / `text-sm`     | Font size  | Ukuran font custom atau default 14px        |
| `text-[{color}]` / `text-blue-800` | Text color | Warna teks (default berdasarkan alert type) |

### 4.3. Icon Classes (`<svg>`)

| Class                                               | Tujuan     | Penjelasan                                            |
| --------------------------------------------------- | ---------- | ----------------------------------------------------- |
| `mt-0.5`                                            | Margin top | Memberikan margin top 2px untuk alignment dengan teks |
| `h-[{value}px] w-[{value}px]` / `h-4 w-4`           | Icon size  | Ukuran icon (default: 16px x 16px)                    |
| `text-blue-600` / `text-green-600` / `text-red-600` | Icon color | Warna icon sesuai alert type                          |

### 4.4. Interactive & Dynamic Classes

| Class                       | Tujuan           | Penjelasan                                           |
| --------------------------- | ---------------- | ---------------------------------------------------- |
| `transition-all`            | Transisi         | Menerapkan transisi pada semua properti yang berubah |
| `duration-[{ms}ms]`         | Durasi transisi  | Durasi transisi dalam milidetik (150ms/300ms/500ms)  |
| `hover:bg-[{color}]`        | Hover background | Mengubah background saat hover (jika diisi)          |
| `hover:border-[{color}]`    | Hover border     | Mengubah border color saat hover (jika diisi)        |
| `focus:outline`             | Focus outline    | Menampilkan outline saat elemen mendapat focus       |
| `focus:outline-[{value}px]` | Focus ring width | Ketebalan outline saat focus                         |
| `focus:outline-[{color}]`   | Focus ring color | Warna outline saat focus                             |

---

## 5. Contoh Output Kode Lengkap

### Contoh 1: Information Alert (Default)

```html
<div role="alert" class="flex items-start gap-3 rounded-[6px] border-[1px] border-blue-200 bg-blue-50 p-[16px] transition-all duration-[300ms]">
  <svg class="mt-0.5 h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Icon SVG information -->
  </svg>
  <div class="space-y-1">
    <div class="font-semibold text-[14px] text-blue-900">Information</div>
    <p class="text-[14px] text-blue-800">This is an informational alert with important details.</p>
  </div>
</div>
```

### Contoh 2: Success Alert dengan Custom Colors

```html
<div role="alert" class="flex items-start gap-3 rounded-[8px] border-[2px] border-[#10B981] bg-[#ECFDF5] p-[20px] w-[400px] transition-all duration-[300ms] hover:bg-[#D1FAE5] focus:outline focus:outline-[2px] focus:outline-[#059669]">
  <svg class="mt-0.5 h-[20px] w-[20px] text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Icon SVG success -->
  </svg>
  <div class="space-y-1">
    <div class="font-semibold text-[16px] text-[#065F46]">Success</div>
    <p class="text-[14px] text-[#047857]">Operation completed successfully!</p>
  </div>
</div>
```

---

## 6. Kesimpulan

### 6.1. Total Class yang Digunakan

- **Layout Classes**: 8-10 classes (flex, items-start, gap-3, rounded, border, bg, padding, width, height)
- **Typography Classes**: 3-4 classes per elemen teks (font-semibold, text-size, text-color)
- **Icon Classes**: 3 classes (mt-0.5, h/w size, text-color)
- **Interactive Classes**: 0-5 classes (transition, hover, focus - opsional)

### 6.2. Karakteristik Mapping

1. **Custom Values**: Menggunakan arbitrary values Tailwind `[{value}]` untuk nilai custom
2. **Default Fallback**: Setiap input memiliki default value jika kosong
3. **Conditional Classes**: Beberapa class hanya ditambahkan jika input diisi (width, height, hover, focus)
4. **Type-based Defaults**: Alert type menentukan default colors yang digunakan

### 6.3. Best Practices yang Diterapkan

- ✅ Menggunakan semantic HTML (`role="alert"`)
- ✅ Responsive design dengan flexbox
- ✅ Accessibility dengan proper color contrast
- ✅ Customizable dengan arbitrary values
- ✅ Interactive states (hover, focus) untuk UX yang lebih baik
- ✅ Transitions untuk animasi yang smooth
