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
      indent_size: 2, // Indentasi 2 spasi
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      wrap_line_length: 120, // Wrap jika lebih dari 120 karakter
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
