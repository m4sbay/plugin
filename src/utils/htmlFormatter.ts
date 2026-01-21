import * as prettier from "prettier";
import * as prettierPluginHtml from "prettier/plugins/html";

/**
 * Format HTML code menggunakan Prettier
 * @param htmlString - String HTML yang akan di-format
 * @returns HTML yang sudah di-format dengan rapi
 */
export async function formatHTML(htmlString: string): Promise<string> {
  if (!htmlString || htmlString.trim() === "") {
    return htmlString;
  }

  try {
    // Preprocessing: Bersihkan semua whitespace yang tidak perlu sebelum formatting
    // Ini memastikan Prettier memformat dari HTML yang benar-benar bersih
    const cleaned = htmlString
      .replace(/\s+/g, " ") // Ganti semua whitespace (termasuk newline, tab) dengan single space
      .replace(/>\s+</g, "><") // Hapus whitespace antara tag
      .replace(/>\s+/g, ">") // Hapus whitespace setelah tag penutup
      .replace(/\s+</g, "<") // Hapus whitespace sebelum tag pembuka
      .trim();

    console.log("[formatHTML] HTML sebelum format:", cleaned.substring(0, 200));

    const formatted = await prettier.format(cleaned, {
      parser: "html",
      plugins: [prettierPluginHtml],
      arrowParens: "always",
      bracketSameLine: false,
      objectWrap: "preserve",
      bracketSpacing: true,
      semi: true,
      experimentalOperatorPosition: "end",
      experimentalTernaries: false,
      singleQuote: false,
      jsxSingleQuote: false,
      quoteProps: "as-needed",
      trailingComma: "all",
      singleAttributePerLine: false,
      htmlWhitespaceSensitivity: "ignore",
      vueIndentScriptAndStyle: false,
      proseWrap: "preserve",
      endOfLine: "lf",
      insertPragma: false,
      printWidth: 1000,
      requirePragma: false,
      tabWidth: 2,
      useTabs: false,
      embeddedLanguageFormatting: "auto",
    });

    console.log("[formatHTML] HTML setelah format:", formatted.substring(0, 200));
    return formatted.trim();
  } catch (error) {
    // Jika terjadi error saat formatting, return original string
    console.error("[formatHTML] Error formatting HTML:", error);
    if (error instanceof Error) {
      console.error("[formatHTML] Error message:", error.message);
      console.error("[formatHTML] Error stack:", error.stack);
    }
    return htmlString;
  }
}




