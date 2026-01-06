import { html } from "js-beautify";

/**
 * Format HTML code dengan indentasi konsisten
 * @param htmlString - String HTML yang akan di-format
 * @returns HTML yang sudah di-format dengan rapi
 */
export function formatHTML(htmlString: string): string {
  if (!htmlString || htmlString.trim() === "") {
    return htmlString;
  }

  try {
    return html(htmlString, {
      indent_size: 2, // Ubah dari 6 ke 2 untuk indentasi yang lebih kompak
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      wrap_line_length: 80, // Kurangi dari 120 ke 80 untuk preview yang lebih baik
      wrap_attributes: "auto", // Auto wrap attributes jika panjang
      end_with_newline: false,
      indent_inner_html: true,
      indent_scripts: "keep",
      unformatted: [], // Format semua elemen
      extra_liners: [], // Tidak menambahkan line break ekstra
    });
  } catch (error) {
    // Jika terjadi error saat formatting, return original string
    console.error("Error formatting HTML:", error);
    return htmlString;
  }
}
