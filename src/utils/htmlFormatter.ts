import * as prettier from "prettier";

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
    const formatted = await prettier.format(htmlString, {
      
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
        htmlWhitespaceSensitivity: "css",
          vueIndentScriptAndStyle: false,
        proseWrap: "preserve",
        endOfLine: "lf",
        insertPragma: false,
        printWidth: 100,
        requirePragma: false,
        tabWidth: 2,
        useTabs: false,
        embeddedLanguageFormatting: "auto"
      
    });

    return formatted.trim();
  } catch (error) {
    // Jika terjadi error saat formatting, return original string
    console.error("Error formatting HTML:", error);
    return htmlString;
  }
}




