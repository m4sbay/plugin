import { once, on, showUI, emit } from "@create-figma-plugin/utilities";
import { CloseHandler, CreateButtonHandler, SelectionChangeHandler, CreateTabsHandler, CreateSwitchHandler, CreateAlertBannerHandler } from "./types/types";

// Fungsi kustom untuk mengkonversi hex ke RGB
function customConvertHexColorToRgbColor(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.trim().toUpperCase();
  if (!cleanHex.startsWith("#")) {
    cleanHex = `#${cleanHex}`;
  }
  if (!/^#[0-9A-F]{6}$/.test(cleanHex)) {
    console.log(`Invalid hex format: ${cleanHex}`);
    return null;
  }
  const r = parseInt(cleanHex.slice(1, 3), 16) / 255;
  const g = parseInt(cleanHex.slice(3, 5), 16) / 255;
  const b = parseInt(cleanHex.slice(5, 7), 16) / 255;
  console.log(`Converted ${cleanHex} to RGB: { r: ${r}, g: ${g}, b: ${b} }`);
  return { r, g, b };
}

export default function () {
  once<CreateButtonHandler>(
    "CREATE_BUTTON",
    async (
      color,
      label,
      borderRadius,
      fontSize,
      padding,
      labelColor,
      htmltailwind,
      borderWidth,
      borderColor,
      hoverTextColor,
      hoverBgColor,
      hoverBorderColor,
      focusBorderColor,
      focusRingSize,
      activeScale,
      activeBgColor,
      activeShadowSize,
      transitionDuration,
      transitionEasing,
      transitionDelay,
      transitionType,
      hoverScaleType,
      hoverOpacity,
      hoverScale,
      hoverTranslateX,
      hoverRotate
    ) => {
      console.log(`CREATE_BUTTON received - color: ${color}, labelColor: ${labelColor}`);
      const rgb = customConvertHexColorToRgbColor(color);
      const labelRgb = customConvertHexColorToRgbColor(labelColor);

      if (rgb === null) {
        console.log(`Invalid background color: ${color}`);
        figma.notify("Warna latar belakang tidak valid: " + color);
        return;
      }

      if (labelRgb === null) {
        console.log(`Invalid label color: ${labelColor}`);
        figma.notify("Warna label tidak valid: " + labelColor);
        return;
      }

      try {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      } catch (error) {
        figma.notify("Gagal memuat font 'Inter Regular': " + error);
        return;
      }

      let paddingLeft = 0;
      let paddingRight = 0;
      let paddingTop = 0;
      let paddingBottom = 0;
      if (padding) {
        const values = padding.split(",").map(val => parseInt(val.trim(), 10));
        if (values.length === 1 && !isNaN(values[0])) {
          paddingLeft = values[0];
          paddingRight = values[0];
          paddingTop = values[0];
          paddingBottom = values[0];
        } else if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
          paddingLeft = values[0];
          paddingRight = values[0];
          paddingTop = values[1];
          paddingBottom = values[1];
        } else {
          figma.notify("Format padding tidak valid, menggunakan 0. Gunakan '2' atau '2,4'");
        }
      }

      const component = figma.createComponent();
      component.layoutMode = "HORIZONTAL";
      component.primaryAxisAlignItems = "CENTER";
      component.counterAxisAlignItems = "CENTER";
      component.primaryAxisSizingMode = "AUTO";
      component.counterAxisSizingMode = "AUTO";
      component.paddingLeft = paddingLeft;
      component.paddingRight = paddingRight;
      component.paddingTop = paddingTop;
      component.paddingBottom = paddingBottom;
      component.itemSpacing = 0;

      const text = figma.createText();
      text.characters = label;
      text.fontName = { family: "Inter", style: "Regular" };
      text.fontSize = fontSize;
      text.fills = [{ type: "SOLID", color: labelRgb }];
      text.layoutAlign = "INHERIT";
      text.constraints = { horizontal: "MIN", vertical: "MIN" };
      text.layoutPositioning = "AUTO";

      component.fills = [{ type: "SOLID", color: rgb }];
      component.cornerRadius = borderRadius;

      // Set border/stroke if borderWidth > 0
      if (borderWidth && borderWidth > 0 && borderColor) {
        const borderRgb = customConvertHexColorToRgbColor(borderColor);
        if (borderRgb) {
          component.strokes = [{ type: "SOLID", color: borderRgb }];
          component.strokeWeight = borderWidth;
        }
      } else {
        // Clear any existing strokes if borderWidth is 0 or null
        component.strokes = [];
        component.strokeWeight = 0;
      }

      const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
      component.setPluginData("id", componentId);
      component.setPluginData("htmltailwind", htmltailwind);

      // Store static styling data
      component.setPluginData("borderWidth", borderWidth?.toString() || "");
      component.setPluginData("borderColor", borderColor || "");

      // Store dynamic styling data
      component.setPluginData("hoverTextColor", hoverTextColor || "");
      component.setPluginData("hoverBgColor", hoverBgColor || "");
      component.setPluginData("hoverBorderColor", hoverBorderColor || "");
      component.setPluginData("focusBorderColor", focusBorderColor || "");
      component.setPluginData("focusRingSize", focusRingSize?.toString() || "");
      component.setPluginData("activeScale", activeScale?.toString() || "");
      component.setPluginData("activeBgColor", activeBgColor || "");
      component.setPluginData("activeShadowSize", activeShadowSize?.toString() || "");
      component.setPluginData("transitionDuration", transitionDuration?.toString() || "");
      component.setPluginData("transitionEasing", transitionEasing || "");
      component.setPluginData("transitionDelay", transitionDelay?.toString() || "");
      component.setPluginData("transitionType", transitionType || "");
      component.setPluginData("hoverScaleType", hoverScaleType || "");
      component.setPluginData("hoverOpacity", hoverOpacity?.toString() || "");
      component.setPluginData("hoverScale", hoverScale?.toString() || "");
      component.setPluginData("hoverTranslateX", hoverTranslateX?.toString() || "");
      component.setPluginData("hoverRotate", hoverRotate?.toString() || "");

      component.appendChild(text);

      figma.currentPage.selection = [component];
      figma.viewport.scrollAndZoomIntoView([component]);
    }
  );

  on<SelectionChangeHandler>("SELECTION_CHANGE", () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const selectedNode = selection[0];
      const htmltailwind = selectedNode.getPluginData("htmltailwind");
      emit<SelectionChangeHandler>("SELECTION_CHANGE", htmltailwind || "");
    } else {
      emit<SelectionChangeHandler>("SELECTION_CHANGE", "");
    }
  });

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const selectedNode = selection[0];
      const htmltailwind = selectedNode.getPluginData("htmltailwind");
      emit<SelectionChangeHandler>("SELECTION_CHANGE", htmltailwind || "");
    } else {
      emit<SelectionChangeHandler>("SELECTION_CHANGE", "");
    }
  });

  on("CREATE_INPUT_FIELD", async props => {
    const { label, placeholder, bgColor, textColor, fontSize, padding, borderRadius, borderColor, borderWidth, shadow, blur } = props;

    // Buat komponen utama
    const component = figma.createComponent();
    component.name = "Input Field";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.itemSpacing = 8;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;

    // Buat label
    const text = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    text.characters = label;
    text.fontSize = Number(fontSize) || 16;
    text.fills = [{ type: "SOLID", color: hexToRgb(textColor) }];

    // Buat rectangle input
    const rect = figma.createRectangle();
    rect.resize(240, 40);
    rect.cornerRadius = Number(borderRadius) || 4;
    rect.fills = [{ type: "SOLID", color: hexToRgb(bgColor) }];
    rect.strokes = [{ type: "SOLID", color: hexToRgb(borderColor) }];
    rect.strokeWeight = Number(borderWidth) || 1;
    // Padding dan shadow (jika ada)
    const effects: Effect[] = [];
    if (shadow !== "0") {
      effects.push({
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 2 },
        radius: Number(shadow),
        visible: true,
        blendMode: "NORMAL",
      });
    }
    if (blur !== "0") {
      effects.push({
        type: "LAYER_BLUR",
        radius: Number(blur),
        visible: true,
      });
    }
    rect.effects = effects;

    // Gabungkan ke komponen
    component.appendChild(text);
    component.appendChild(rect);

    // (Opsional) Simpan data plugin
    component.setPluginData("inputFieldProps", JSON.stringify(props));

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];
  });

  on("CREATE_CHECKBOX", async props => {
    const {
      headingLabel,
      headingFontSize,
      headingColor,
      checkboxLabel,
      checkboxCount,
      labelColor,
      labelFontSize,
      checkboxSize,
      borderWidth,
      borderRadius,
      borderColor,
      checkedBgColor,
      checkedBorderColor,
      uncheckedBgColor,
      gapBetweenCheckboxLabel,
      hoverBorderColor,
      hoverBgColor,
      focusRingWidth,
      focusRingColor,
      transitionType,
      htmltailwind,
    } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Buat component (bukan frame)
    const component = figma.createComponent();
    component.name = "Checkbox";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.itemSpacing = 12;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.fills = [];

    // Buat heading text di atas
    const headingText = figma.createText();
    headingText.characters = headingLabel;
    headingText.fontName = { family: "Inter", style: "Medium" };
    headingText.fontSize = Number(headingFontSize) || 16;
    headingText.fills = [{ type: "SOLID", color: hexToRgb(headingColor) }];
    headingText.name = "Heading";

    component.appendChild(headingText);

    // Buat multiple checkbox sesuai checkboxCount
    const count = parseInt(checkboxCount) || 1;
    for (let i = 0; i < count; i++) {
      // Buat frame untuk checkbox + label inline
      const checkboxRow = figma.createFrame();
      checkboxRow.name = `Checkbox ${i + 1}`;
      checkboxRow.layoutMode = "HORIZONTAL";
      checkboxRow.counterAxisSizingMode = "AUTO";
      checkboxRow.primaryAxisSizingMode = "AUTO";
      checkboxRow.itemSpacing = Number(gapBetweenCheckboxLabel) || 8;
      checkboxRow.fills = [];

      // Buat checkbox box
      const checkboxBox = figma.createRectangle();
      checkboxBox.name = "Checkbox Box";
      checkboxBox.resize(Number(checkboxSize) || 20, Number(checkboxSize) || 20);
      checkboxBox.cornerRadius = Number(borderRadius) || 4;
      checkboxBox.fills = [{ type: "SOLID", color: hexToRgb(uncheckedBgColor) }];
      checkboxBox.strokes = [{ type: "SOLID", color: hexToRgb(borderColor) }];
      checkboxBox.strokeWeight = Number(borderWidth) || 2;

      // Buat label inline (setelah checkbox)
      const inlineLabel = figma.createText();
      inlineLabel.characters = count > 1 ? `${checkboxLabel} ${i + 1}` : checkboxLabel;
      inlineLabel.fontName = { family: "Inter", style: "Regular" };
      inlineLabel.fontSize = Number(labelFontSize) || 14;
      inlineLabel.fills = [{ type: "SOLID", color: hexToRgb(labelColor) }];
      inlineLabel.name = "Label";

      // Susun checkbox row
      checkboxRow.appendChild(checkboxBox);
      checkboxRow.appendChild(inlineLabel);

      // Tambahkan checkbox row ke component
      component.appendChild(checkboxRow);
    }

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("checkboxProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("headingLabel", headingLabel);
    component.setPluginData("headingFontSize", headingFontSize);
    component.setPluginData("headingColor", headingColor);
    component.setPluginData("checkboxLabel", checkboxLabel);
    component.setPluginData("checkboxCount", checkboxCount);
    component.setPluginData("labelColor", labelColor);
    component.setPluginData("labelFontSize", labelFontSize);
    component.setPluginData("checkboxSize", checkboxSize);
    component.setPluginData("borderWidth", borderWidth);
    component.setPluginData("borderRadius", borderRadius);
    component.setPluginData("borderColor", borderColor);
    component.setPluginData("checkedBgColor", checkedBgColor);
    component.setPluginData("checkedBorderColor", checkedBorderColor);
    component.setPluginData("uncheckedBgColor", uncheckedBgColor);
    component.setPluginData("hoverBorderColor", hoverBorderColor);
    component.setPluginData("hoverBgColor", hoverBgColor);
    component.setPluginData("focusRingWidth", focusRingWidth);
    component.setPluginData("focusRingColor", focusRingColor);
    component.setPluginData("transitionType", transitionType);

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Checkbox berhasil dibuat (${count} checkbox)!`);
  });

  on("CREATE_TEXT_FIELD", async props => {
    const { label, labelColor, fontSize, placeholder, width, height, bgColor, borderRadius, outlineWidth, outlineColor, padding, shadow, hoverBgColor, activeRingWidth, ringColor, transitionType, labelGap, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter Regular': " + error);
      return;
    }

    // Parse labelGap untuk jarak antara label dan input
    let gapValue = 8; // default
    if (labelGap) {
      const gapMatch = labelGap.match(/(\d+)/);
      if (gapMatch) gapValue = Number(gapMatch[1]);
    }

    // Buat komponen utama (dengan status component)
    const component = figma.createComponent();
    component.name = "Text Field";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.itemSpacing = gapValue; // Jarak antara label dan input dari user
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.fills = [];

    // Buat label text
    if (label) {
      const labelText = figma.createText();
      labelText.characters = label;
      labelText.fontName = { family: "Inter", style: "Regular" };
      labelText.fontSize = Number(fontSize) || 16;
      labelText.fills = [{ type: "SOLID", color: hexToRgb(labelColor || "#222222") }];
      labelText.name = "Label";
      component.appendChild(labelText);
    }

    // Parse width dan height
    let inputWidth = 240; // default
    let inputHeight = 40; // default

    if (width) {
      const widthMatch = width.match(/(\d+)/);
      if (widthMatch) inputWidth = Number(widthMatch[1]);
    }
    if (height) {
      const heightMatch = height.match(/(\d+)/);
      if (heightMatch) inputHeight = Number(heightMatch[1]);
    }

    // Parse padding untuk input field
    let paddingLeft = 0;
    let paddingRight = 0;
    let paddingTop = 0;
    let paddingBottom = 0;

    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => parseInt(val.trim().replace("px", ""), 10));
      if (paddingValues.length === 1 && !isNaN(paddingValues[0])) {
        paddingLeft = paddingValues[0];
        paddingRight = paddingValues[0];
        paddingTop = paddingValues[0];
        paddingBottom = paddingValues[0];
      } else if (paddingValues.length === 2 && !isNaN(paddingValues[0]) && !isNaN(paddingValues[1])) {
        paddingLeft = paddingValues[0];
        paddingRight = paddingValues[0];
        paddingTop = paddingValues[1];
        paddingBottom = paddingValues[1];
      }
    }

    // Buat frame untuk input field dengan autolayout dan padding
    const inputFrame = figma.createFrame();
    inputFrame.name = "Input Field";
    inputFrame.layoutMode = "HORIZONTAL";
    inputFrame.counterAxisSizingMode = "FIXED";
    inputFrame.primaryAxisSizingMode = "FIXED";
    inputFrame.primaryAxisAlignItems = "CENTER"; // Center horizontal
    inputFrame.counterAxisAlignItems = "CENTER"; // Center vertical
    inputFrame.resize(inputWidth, inputHeight);
    inputFrame.cornerRadius = Number(borderRadius) || 4;
    inputFrame.fills = [{ type: "SOLID", color: hexToRgb(bgColor || "#FFFFFF") }];
    inputFrame.paddingLeft = paddingLeft;
    inputFrame.paddingRight = paddingRight;
    inputFrame.paddingTop = paddingTop;
    inputFrame.paddingBottom = paddingBottom;

    // Set outline/border jika ada
    if (outlineWidth && Number(outlineWidth) > 0) {
      inputFrame.strokes = [{ type: "SOLID", color: hexToRgb(outlineColor || "#D1D5DB") }];
      inputFrame.strokeWeight = Number(outlineWidth);
    }

    // Buat placeholder text di dalam input (jika ada placeholder)
    if (placeholder) {
      const placeholderText = figma.createText();
      placeholderText.characters = placeholder;
      placeholderText.fontName = { family: "Inter", style: "Regular" };
      placeholderText.fontSize = Number(fontSize) || 16;
      placeholderText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.5 }]; // Gray dengan opacity untuk placeholder
      placeholderText.name = "Placeholder";
      placeholderText.layoutAlign = "INHERIT"; // Mengikuti alignment dari parent frame
      placeholderText.constraints = { horizontal: "MIN", vertical: "MIN" };
      placeholderText.layoutPositioning = "AUTO";
      // Set text alignment untuk center horizontal dan vertical
      placeholderText.textAlignHorizontal = "CENTER";
      placeholderText.textAlignVertical = "CENTER";
      inputFrame.appendChild(placeholderText);
    }

    // Set shadow effect jika ada
    if (shadow) {
      const effects: Effect[] = [];
      // Parse shadow format seperti "0_2px_12px_rgba(0,0,0,0.08)"
      const shadowMatch = shadow.match(/(\d+)[px]*\s+(\d+)[px]*\s+(\d+)[px]*/);
      if (shadowMatch) {
        effects.push({
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          offset: { x: Number(shadowMatch[1]) || 0, y: Number(shadowMatch[2]) || 2 },
          radius: Number(shadowMatch[3]) || 12,
          visible: true,
          blendMode: "NORMAL",
        });
      }
      inputFrame.effects = effects;
    }

    // Tambahkan input frame ke component
    component.appendChild(inputFrame);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");

    // Store semua styling data
    component.setPluginData("label", label || "");
    component.setPluginData("labelColor", labelColor || "");
    component.setPluginData("fontSize", fontSize || "");
    component.setPluginData("placeholder", placeholder || "");
    component.setPluginData("width", width || "");
    component.setPluginData("height", height || "");
    component.setPluginData("bgColor", bgColor || "");
    component.setPluginData("borderRadius", borderRadius || "");
    component.setPluginData("outlineWidth", outlineWidth || "");
    component.setPluginData("outlineColor", outlineColor || "");
    component.setPluginData("padding", padding || "");
    component.setPluginData("shadow", shadow || "");
    component.setPluginData("hoverBgColor", hoverBgColor || "");
    component.setPluginData("activeRingWidth", activeRingWidth || "");
    component.setPluginData("ringColor", ringColor || "");
    component.setPluginData("transitionType", transitionType || "");
    component.setPluginData("labelGap", labelGap || "8");

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify("✅ Text Field berhasil dibuat!");
  });

  on("CREATE_TOOLTIP", async props => {
    const { tooltipText, buttonText, position, fontSize, bgColor, textColor, borderRadius, padding, buttonBgColor, buttonTextColor, buttonHoverBgColor, buttonFocusRingColor, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter Regular': " + error);
      return;
    }

    // Parse padding
    let paddingTop = 8;
    let paddingBottom = 8;
    let paddingLeft = 12;
    let paddingRight = 12;

    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => parseInt(val.trim().replace("px", ""), 10));
      if (paddingValues.length === 2 && !isNaN(paddingValues[0]) && !isNaN(paddingValues[1])) {
        paddingTop = paddingValues[0];
        paddingBottom = paddingValues[0];
        paddingLeft = paddingValues[1];
        paddingRight = paddingValues[1];
      }
    }

    // Parse fontSize
    const fontSizeValue = Number(fontSize.replace(/px/gi, "").trim()) || 14;
    const borderRadiusValue = Number(borderRadius.replace(/px/gi, "").trim()) || 8;

    // Buat komponen utama dengan status component
    const component = figma.createComponent();
    component.name = "Tooltip";
    component.layoutMode = "HORIZONTAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.itemSpacing = 0;
    component.fills = [];

    // Buat button trigger
    const buttonFrame = figma.createFrame();
    buttonFrame.name = "Button";
    buttonFrame.layoutMode = "HORIZONTAL";
    buttonFrame.counterAxisSizingMode = "AUTO";
    buttonFrame.primaryAxisSizingMode = "AUTO";
    buttonFrame.primaryAxisAlignItems = "CENTER";
    buttonFrame.counterAxisAlignItems = "CENTER";
    buttonFrame.paddingLeft = 20;
    buttonFrame.paddingRight = 20;
    buttonFrame.paddingTop = 10;
    buttonFrame.paddingBottom = 10;
    buttonFrame.cornerRadius = 8;
    buttonFrame.fills = [{ type: "SOLID", color: hexToRgb(buttonBgColor || "#1D4ED8") }];
    buttonFrame.itemSpacing = 0;

    const buttonTextNode = figma.createText();
    buttonTextNode.characters = buttonText;
    buttonTextNode.fontName = { family: "Inter", style: "Regular" };
    buttonTextNode.fontSize = 14;
    buttonTextNode.fills = [{ type: "SOLID", color: hexToRgb(buttonTextColor || "#FFFFFF") }];
    buttonTextNode.layoutAlign = "INHERIT";
    buttonTextNode.constraints = { horizontal: "MIN", vertical: "MIN" };
    buttonTextNode.layoutPositioning = "AUTO";

    buttonFrame.appendChild(buttonTextNode);

    // Buat tooltip box
    const tooltipFrame = figma.createFrame();
    tooltipFrame.name = "Tooltip";
    tooltipFrame.layoutMode = "HORIZONTAL";
    tooltipFrame.counterAxisSizingMode = "AUTO";
    tooltipFrame.primaryAxisSizingMode = "AUTO";
    tooltipFrame.primaryAxisAlignItems = "CENTER";
    tooltipFrame.counterAxisAlignItems = "CENTER";
    tooltipFrame.paddingLeft = paddingLeft;
    tooltipFrame.paddingRight = paddingRight;
    tooltipFrame.paddingTop = paddingTop;
    tooltipFrame.paddingBottom = paddingBottom;
    tooltipFrame.cornerRadius = borderRadiusValue;
    tooltipFrame.fills = [{ type: "SOLID", color: hexToRgb(bgColor || "#111827") }];
    tooltipFrame.itemSpacing = 0;

    const tooltipTextNode = figma.createText();
    tooltipTextNode.characters = tooltipText;
    tooltipTextNode.fontName = { family: "Inter", style: "Regular" };
    tooltipTextNode.fontSize = fontSizeValue;
    tooltipTextNode.fills = [{ type: "SOLID", color: hexToRgb(textColor || "#FFFFFF") }];
    tooltipTextNode.layoutAlign = "INHERIT";
    tooltipTextNode.constraints = { horizontal: "MIN", vertical: "MIN" };
    tooltipTextNode.layoutPositioning = "AUTO";

    tooltipFrame.appendChild(tooltipTextNode);

    // Susun komponen berdasarkan posisi
    if (position === "top") {
      component.layoutMode = "VERTICAL";
      component.itemSpacing = 8;
      component.appendChild(tooltipFrame);
      component.appendChild(buttonFrame);
    } else if (position === "bottom") {
      component.layoutMode = "VERTICAL";
      component.itemSpacing = 8;
      component.appendChild(buttonFrame);
      component.appendChild(tooltipFrame);
    } else if (position === "left") {
      component.layoutMode = "HORIZONTAL";
      component.itemSpacing = 8;
      component.appendChild(tooltipFrame);
      component.appendChild(buttonFrame);
    } else {
      // right atau default
      component.layoutMode = "HORIZONTAL";
      component.itemSpacing = 8;
      component.appendChild(buttonFrame);
      component.appendChild(tooltipFrame);
    }

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("tooltipProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("tooltipText", tooltipText || "");
    component.setPluginData("buttonText", buttonText || "");
    component.setPluginData("position", position || "top");
    component.setPluginData("fontSize", fontSize || "14");
    component.setPluginData("bgColor", bgColor || "#111827");
    component.setPluginData("textColor", textColor || "#FFFFFF");
    component.setPluginData("borderRadius", borderRadius || "8");
    component.setPluginData("padding", padding || "8px,12px");
    component.setPluginData("buttonBgColor", buttonBgColor || "#1D4ED8");
    component.setPluginData("buttonTextColor", buttonTextColor || "#FFFFFF");
    component.setPluginData("buttonHoverBgColor", buttonHoverBgColor || "#1E40AF");
    component.setPluginData("buttonFocusRingColor", buttonFocusRingColor || "#60A5FA");

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify("✅ Tooltip berhasil dibuat!");
  });

  on<CreateTabsHandler>("CREATE_TABS", async props => {
    const { tabCount, tabLabels, fontSize, containerBgColor, activeBgColor, activeTextColor, inactiveTextColor, tabPadding, tabBorderRadius, tabGap, containerPadding, panelContents, transitionType, tabsWidth, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Parse values
    const labels = tabLabels.split(",").map(l => l.trim());
    const contents = panelContents.split(",").map(c => c.trim());
    const tabCountNum = parseInt(tabCount) || labels.length;
    const py = tabPadding.split(",")[0]?.trim() || "6";
    const px = tabPadding.split(",")[1]?.trim() || "24";
    const borderRadius = parseFloat(tabBorderRadius) || 9999;
    const gap = parseFloat(tabGap) || 4;
    const containerPad = parseFloat(containerPadding) || 4;
    const fontSizeValue = parseFloat(fontSize) || 14;
    const tabsWidthValue = tabsWidth ? parseFloat(tabsWidth) : null;

    // Buat component utama
    const component = figma.createComponent();
    component.name = "Tabs";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.itemSpacing = 4;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.primaryAxisAlignItems = "CENTER";
    component.counterAxisAlignItems = "CENTER";
    component.fills = [];

    // Buat frame untuk tabs container
    const tabsContainer = figma.createFrame();
    tabsContainer.name = "Tabs Container";
    tabsContainer.layoutMode = "HORIZONTAL";
    tabsContainer.counterAxisSizingMode = "AUTO";
    tabsContainer.primaryAxisSizingMode = "AUTO";
    tabsContainer.primaryAxisAlignItems = "CENTER";
    tabsContainer.counterAxisAlignItems = "CENTER";
    tabsContainer.itemSpacing = gap;
    tabsContainer.paddingLeft = containerPad;
    tabsContainer.paddingRight = containerPad;
    tabsContainer.paddingTop = containerPad;
    tabsContainer.paddingBottom = containerPad;
    tabsContainer.fills = [{ type: "SOLID", color: hexToRgb(containerBgColor) }];
    tabsContainer.cornerRadius = 9999; // rounded-full

    // Buat tabs
    for (let i = 0; i < tabCountNum && i < labels.length; i++) {
      const tabFrame = figma.createFrame();
      tabFrame.name = `Tab ${i + 1}`;
      tabFrame.layoutMode = "HORIZONTAL";
      tabFrame.counterAxisSizingMode = "AUTO";
      tabFrame.primaryAxisSizingMode = "AUTO";
      tabFrame.layoutGrow = 1;
      tabFrame.layoutAlign = "STRETCH";
      tabFrame.primaryAxisAlignItems = "CENTER";
      tabFrame.counterAxisAlignItems = "CENTER";
      tabFrame.paddingLeft = parseFloat(px);
      tabFrame.paddingRight = parseFloat(px);
      tabFrame.paddingTop = parseFloat(py);
      tabFrame.paddingBottom = parseFloat(py);
      tabFrame.fills = i === 0 ? [{ type: "SOLID", color: hexToRgb(activeBgColor) }] : [];
      tabFrame.cornerRadius = borderRadius;
      tabFrame.effects =
        i === 0
          ? [
              {
                type: "DROP_SHADOW",
                color: { r: 0, g: 0, b: 0, a: 0.05 },
                offset: { x: 0, y: 1 },
                radius: 2,
                visible: true,
                blendMode: "NORMAL",
              },
              {
                type: "DROP_SHADOW",
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 1 },
                radius: 3,
                visible: true,
                blendMode: "NORMAL",
              },
            ]
          : [];

      // Buat text untuk tab
      const tabText = figma.createText();
      tabText.characters = labels[i] || `Tab ${i + 1}`;
      tabText.fontName = { family: "Inter", style: i === 0 ? "Medium" : "Regular" };
      tabText.fontSize = fontSizeValue;
      tabText.fills = [
        {
          type: "SOLID",
          color: hexToRgb(i === 0 ? activeTextColor : inactiveTextColor),
        },
      ];
      tabText.name = "Label";

      tabFrame.appendChild(tabText);
      tabsContainer.appendChild(tabFrame);
    }

    // Set width setelah tabs dibuat (height sudah tersedia)
    if (tabsWidthValue) {
      tabsContainer.resize(tabsWidthValue, tabsContainer.height);
    }

    // Set lebar tab yang sama untuk semua tabs (membagi lebar container secara merata)
    // Hitung lebar yang tersedia setelah padding dan gap
    const availableWidth = tabsContainer.width - containerPad * 2 - gap * (tabCountNum - 1);
    const equalTabWidth = availableWidth / tabCountNum;

    // Set lebar setiap tab secara manual
    for (let i = 0; i < tabsContainer.children.length; i++) {
      const tabFrame = tabsContainer.children[i] as FrameNode;
      if (tabFrame.type === "FRAME") {
        tabFrame.primaryAxisSizingMode = "FIXED";
        tabFrame.resize(equalTabWidth, tabFrame.height);
      }
    }

    component.appendChild(tabsContainer);

    // Buat frame untuk panels
    const panelsContainer = figma.createFrame();
    panelsContainer.name = "Panels";
    panelsContainer.layoutMode = "VERTICAL";
    panelsContainer.counterAxisSizingMode = "AUTO";
    panelsContainer.primaryAxisSizingMode = "AUTO";
    panelsContainer.itemSpacing = 0;
    panelsContainer.fills = [];
    panelsContainer.paddingLeft = 0;
    panelsContainer.paddingRight = 0;
    panelsContainer.paddingTop = 0;
    panelsContainer.paddingBottom = 0;

    // Buat panel pertama (aktif)
    if (contents.length > 0) {
      const panelFrame = figma.createFrame();
      panelFrame.name = "Panel 1";
      panelFrame.layoutMode = "VERTICAL";
      panelFrame.counterAxisSizingMode = "AUTO";
      panelFrame.primaryAxisSizingMode = "AUTO";
      panelFrame.primaryAxisAlignItems = "CENTER";
      panelFrame.counterAxisAlignItems = "CENTER";
      panelFrame.fills = [];
      panelFrame.paddingLeft = 0;
      panelFrame.paddingRight = 0;
      panelFrame.paddingTop = 12;
      panelFrame.paddingBottom = 12;

      const panelText = figma.createText();
      panelText.characters = contents[0] || "Panel content";
      panelText.fontName = { family: "Inter", style: "Regular" };
      panelText.fontSize = 14;
      panelText.fills = [{ type: "SOLID", color: hexToRgb("#64748b") }];
      panelText.textAlignHorizontal = "CENTER";
      panelText.textAutoResize = "HEIGHT";
      panelText.autoRename = false;
      panelText.name = "Content";
      panelText.layoutAlign = "STRETCH";
      panelText.layoutGrow = 1;
      panelText.constraints = { horizontal: "CENTER", vertical: "CENTER" };

      panelFrame.appendChild(panelText);
      panelsContainer.appendChild(panelFrame);
    }

    component.appendChild(panelsContainer);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("tabsProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("tabCount", tabCount);
    component.setPluginData("tabLabels", tabLabels);
    component.setPluginData("fontSize", fontSize);
    component.setPluginData("containerBgColor", containerBgColor);
    component.setPluginData("activeBgColor", activeBgColor);
    component.setPluginData("activeTextColor", activeTextColor);
    component.setPluginData("inactiveTextColor", inactiveTextColor);
    component.setPluginData("tabPadding", tabPadding);
    component.setPluginData("tabBorderRadius", tabBorderRadius);
    component.setPluginData("tabGap", tabGap);
    component.setPluginData("containerPadding", containerPadding);
    component.setPluginData("panelContents", panelContents);
    component.setPluginData("transitionType", transitionType);
    component.setPluginData("tabsWidth", tabsWidth || "");

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Tabs berhasil dibuat (${tabCountNum} tabs)!`);
  });

  on<CreateSwitchHandler>("CREATE_SWITCH", async props => {
    const {
      switchCount,
      switchLabels,
      containerWidth,
      headlineText,
      headlineColor,
      headlineFontSize,
      labelColor,
      labelFontSize,
      switchWidth,
      switchHeight,
      toggleSize,
      borderRadius,
      uncheckedBorderColor,
      uncheckedBgColor,
      checkedBorderColor,
      checkedBgColor,
      toggleBgColor,
      defaultCheckedStates,
      disabledStates,
      focusRingWidth,
      focusRingColor,
      transitionType,
      htmltailwind,
    } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Parse values
    const count = parseInt(switchCount) || 1;
    const labels = switchLabels.split(",").map(l => l.trim());
    const checkedStates = defaultCheckedStates.split(",").map(c => c.trim() === "true");
    const disabledStatesArray = disabledStates.split(",").map(d => d.trim() === "true");
    const switchWidthValue = Number(switchWidth) || 44;
    const switchHeightValue = Number(switchHeight) || 24;
    const toggleSizeValue = Number(toggleSize) || 20;
    const borderRadiusValue = Number(borderRadius) || 9999;
    const labelFontSizeValue = Number(labelFontSize) || 14;
    const headlineFontSizeValue = Number(headlineFontSize) || 18;
    const containerWidthValue = containerWidth ? Number(containerWidth) : null;

    // Buat component utama (container/card)
    const component = figma.createComponent();
    component.name = "Switch";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO"; // Set AUTO dulu, akan di-resize setelah semua switch dibuat
    component.itemSpacing = 0;
    component.paddingLeft = 24;
    component.paddingRight = 24;
    component.paddingTop = 24;
    component.paddingBottom = 24;
    component.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; // White background
    component.strokes = [{ type: "SOLID", color: { r: 0.89, g: 0.89, b: 0.89 } }]; // Border
    component.strokeWeight = 1;
    component.cornerRadius = 12;

    // Buat headline text
    if (headlineText) {
      const headlineTextNode = figma.createText();
      headlineTextNode.characters = headlineText;
      headlineTextNode.fontName = { family: "Inter", style: "Medium" };
      headlineTextNode.fontSize = headlineFontSizeValue;
      headlineTextNode.fills = [{ type: "SOLID", color: hexToRgb(headlineColor) }];
      headlineTextNode.name = "Headline";
      headlineTextNode.constraints = { horizontal: "MIN", vertical: "MIN" };
      headlineTextNode.layoutPositioning = "AUTO";
      headlineTextNode.layoutAlign = "INHERIT";
      component.appendChild(headlineTextNode);
    }

    // Array untuk menyimpan switch rows
    const switchRows: FrameNode[] = [];

    // Buat setiap switch
    for (let i = 0; i < count; i++) {
      const label = labels[i] || `Switch ${i + 1}`;
      const isChecked = checkedStates[i] || false;
      const isDisabled = disabledStatesArray[i] || false;

      // Buat frame untuk switch row (label + switch)
      const switchRow = figma.createFrame();
      switchRow.name = `Switch ${i + 1}`;
      switchRow.layoutMode = "HORIZONTAL";
      switchRow.counterAxisSizingMode = "AUTO";
      switchRow.primaryAxisSizingMode = "AUTO"; // Set AUTO dulu, akan di-resize setelah children dibuat
      switchRow.primaryAxisAlignItems = "SPACE_BETWEEN";
      switchRow.counterAxisAlignItems = "CENTER";
      switchRow.itemSpacing = 0;
      switchRow.paddingLeft = 0;
      switchRow.paddingRight = 0;
      switchRow.paddingTop = 8;
      switchRow.paddingBottom = 8;
      switchRow.fills = [];
      switchRow.opacity = isDisabled ? 0.5 : 1;

      // Buat label text (dengan lebar AUTO/default sesuai konten)
      const labelText = figma.createText();
      labelText.characters = label;
      labelText.fontName = { family: "Inter", style: "Medium" };
      labelText.fontSize = labelFontSizeValue;
      labelText.fills = [{ type: "SOLID", color: hexToRgb(labelColor) }];
      labelText.name = "Label";
      // Set constraints agar label tidak melebar, hanya sesuai konten
      labelText.constraints = { horizontal: "MIN", vertical: "MIN" };
      labelText.layoutPositioning = "AUTO";
      labelText.layoutAlign = "INHERIT";
      // Label akan menggunakan lebar AUTO sesuai panjang teks, tidak melebar
      switchRow.appendChild(labelText);

      // Buat frame untuk switch track (background)
      // Tidak menggunakan autolayout agar toggle circle bisa diposisikan manual
      const switchTrack = figma.createFrame();
      switchTrack.name = "Switch Track";
      switchTrack.resize(switchWidthValue, switchHeightValue);
      switchTrack.cornerRadius = borderRadiusValue;
      switchTrack.fills = [{ type: "SOLID", color: hexToRgb(isChecked ? checkedBgColor : uncheckedBgColor) }];
      switchTrack.strokes = [{ type: "SOLID", color: hexToRgb(isChecked ? checkedBorderColor : uncheckedBorderColor) }];
      switchTrack.strokeWeight = 1;

      // Buat toggle circle
      const toggleCircle = figma.createEllipse();
      toggleCircle.name = "Toggle Circle";
      toggleCircle.resize(toggleSizeValue, toggleSizeValue);
      toggleCircle.fills = [{ type: "SOLID", color: hexToRgb(toggleBgColor) }];
      toggleCircle.strokes = [];
      toggleCircle.effects = [
        {
          type: "DROP_SHADOW",
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: 1 },
          radius: 2,
          visible: true,
          blendMode: "NORMAL",
        },
      ];

      // Posisikan toggle circle berdasarkan checked state
      // Karena switchTrack tidak menggunakan autolayout, posisi manual akan bekerja
      const translateX = isChecked ? switchWidthValue - toggleSizeValue - 2 : 2;
      toggleCircle.x = translateX;
      toggleCircle.y = (switchHeightValue - toggleSizeValue) / 2;

      // Set constraints untuk anchor yang tepat
      if (isChecked) {
        toggleCircle.constraints = { horizontal: "MAX", vertical: "CENTER" };
      } else {
        toggleCircle.constraints = { horizontal: "MIN", vertical: "CENTER" };
      }

      switchTrack.appendChild(toggleCircle);
      switchRow.appendChild(switchTrack);

      // Tambahkan switch row ke component
      component.appendChild(switchRow);
      switchRows.push(switchRow);
    }

    // Set lebar container dan switch rows setelah semua dibuat
    if (containerWidthValue) {
      // Resize container
      component.primaryAxisSizingMode = "FIXED";
      component.resize(containerWidthValue, component.height);

      // Resize setiap switch row
      for (const switchRow of switchRows) {
        switchRow.primaryAxisSizingMode = "FIXED";
        switchRow.resize(containerWidthValue - 48, switchRow.height); // 24px padding kiri + 24px padding kanan
      }
    }

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("switchProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("switchCount", switchCount);
    component.setPluginData("switchLabels", switchLabels);
    component.setPluginData("containerWidth", containerWidth || "");
    component.setPluginData("headlineText", headlineText || "");
    component.setPluginData("headlineColor", headlineColor || "");
    component.setPluginData("headlineFontSize", headlineFontSize || "");
    component.setPluginData("labelColor", labelColor);
    component.setPluginData("labelFontSize", labelFontSize);
    component.setPluginData("switchWidth", switchWidth);
    component.setPluginData("switchHeight", switchHeight);
    component.setPluginData("toggleSize", toggleSize);
    component.setPluginData("borderRadius", borderRadius);
    component.setPluginData("uncheckedBorderColor", uncheckedBorderColor);
    component.setPluginData("uncheckedBgColor", uncheckedBgColor);
    component.setPluginData("checkedBorderColor", checkedBorderColor);
    component.setPluginData("checkedBgColor", checkedBgColor);
    component.setPluginData("toggleBgColor", toggleBgColor);
    component.setPluginData("defaultCheckedStates", defaultCheckedStates);
    component.setPluginData("disabledStates", disabledStates);
    component.setPluginData("focusRingWidth", focusRingWidth);
    component.setPluginData("focusRingColor", focusRingColor);
    component.setPluginData("transitionType", transitionType);

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Switch berhasil dibuat (${count} switch)!`);
  });

  on<CreateAlertBannerHandler>("CREATE_ALERT_BANNER", async props => {
    const {
      alertType,
      title,
      message,
      borderRadius,
      width,
      height,
      padding,
      iconSize,
      titleFontSize,
      titleColor,
      messageFontSize,
      messageColor,
      borderWidth,
      borderColor,
      bgColor,
      hoverBgColor,
      hoverBorderColor,
      focusRingWidth,
      focusRingColor,
      transitionType,
      htmltailwind,
    } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Get default colors based on alert type
    const getDefaultColors = () => {
      switch (alertType) {
        case "information":
          return {
            border: "#BFDBFE", // blue-200
            bg: "#EFF6FF", // blue-50
            iconColor: "#2563EB", // blue-600
            titleColor: "#1E3A8A", // blue-900
            messageColor: "#1E40AF", // blue-800
          };
        case "success":
          return {
            border: "#BBF7D0", // green-200
            bg: "#F0FDF4", // green-50
            iconColor: "#16A34A", // green-600
            titleColor: "#14532D", // green-900
            messageColor: "#166534", // green-800
          };
        case "error":
          return {
            border: "#FECACA", // red-200
            bg: "#FEF2F2", // red-50
            iconColor: "#DC2626", // red-600
            titleColor: "#7F1D1D", // red-900
            messageColor: "#991B1B", // red-800
          };
        default:
          return {
            border: "#BFDBFE",
            bg: "#EFF6FF",
            iconColor: "#2563EB",
            titleColor: "#1E3A8A",
            messageColor: "#1E40AF",
          };
      }
    };

    const defaultColors = getDefaultColors();
    // Use custom colors or defaults
    const finalBgColor = bgColor || defaultColors.bg;
    const finalBorderColor = borderColor || defaultColors.border;
    const finalTitleColor = titleColor || defaultColors.titleColor;
    const finalMessageColor = messageColor || defaultColors.messageColor;
    const finalIconColor = defaultColors.iconColor;

    const borderRadiusValue = Number(borderRadius) || 6;
    const paddingValue = Number(padding) || 16;
    const borderWidthValue = Number(borderWidth) || 1;
    const iconSizeValue = Number(iconSize) || 16;
    const titleFontSizeValue = Number(titleFontSize) || 14;
    const messageFontSizeValue = Number(messageFontSize) || 14;

    // Buat component utama
    const component = figma.createComponent();
    component.name = "Alert Banner";
    component.layoutMode = "HORIZONTAL";
    component.counterAxisSizingMode = width ? "FIXED" : "AUTO";
    component.primaryAxisSizingMode = width ? "FIXED" : "AUTO";
    component.primaryAxisAlignItems = "MIN";
    component.counterAxisAlignItems = "MIN";
    component.itemSpacing = 12; // gap-3
    component.paddingLeft = paddingValue;
    component.paddingRight = paddingValue;
    component.paddingTop = paddingValue;
    component.paddingBottom = paddingValue;
    component.cornerRadius = borderRadiusValue;
    component.fills = [{ type: "SOLID", color: hexToRgb(finalBgColor) }];
    component.strokes = [{ type: "SOLID", color: hexToRgb(finalBorderColor) }];
    component.strokeWeight = borderWidthValue;

    // Set width and height if provided
    if (width) {
      component.resize(Number(width), component.height);
    }
    if (height && width) {
      component.resize(Number(width), Number(height));
    }

    // Buat icon SVG berdasarkan alert type
    let iconNode: SceneNode;

    if (alertType === "information") {
      // Info icon: circle dengan i (titik di atas, garis di bawah)
      const iconFrame = figma.createFrame();
      iconFrame.name = "Icon";
      iconFrame.resize(iconSizeValue, iconSizeValue);
      iconFrame.fills = [];

      // Circle
      const circle = figma.createEllipse();
      circle.resize(iconSizeValue, iconSizeValue);
      circle.fills = [];
      circle.strokes = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      circle.strokeWeight = 2;

      // Titik di atas (rectangle kecil)
      const dot = figma.createRectangle();
      dot.resize(2, 2);
      dot.x = iconSizeValue / 2 - 1;
      dot.y = iconSizeValue / 2 - 6;
      dot.fills = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      dot.cornerRadius = 1;

      // Garis vertikal di bawah (rectangle tipis)
      const line = figma.createRectangle();
      line.resize(2, 4);
      line.x = iconSizeValue / 2 - 1;
      line.y = iconSizeValue / 2 + 2;
      line.fills = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      line.cornerRadius = 0;

      iconFrame.appendChild(circle);
      iconFrame.appendChild(dot);
      iconFrame.appendChild(line);
      iconNode = iconFrame;
    } else if (alertType === "success") {
      // Success icon: checkmark circle
      const iconFrame = figma.createFrame();
      iconFrame.name = "Icon";
      iconFrame.resize(iconSizeValue, iconSizeValue);
      iconFrame.fills = [];

      // Circle
      const circle = figma.createEllipse();
      circle.resize(iconSizeValue, iconSizeValue);
      circle.fills = [];
      circle.strokes = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      circle.strokeWeight = 2;

      // Checkmark menggunakan vector path
      const checkPath = figma.createVector();
      const centerX = iconSizeValue / 2;
      const centerY = iconSizeValue / 2;
      checkPath.vectorPaths = [
        {
          windingRule: "NONZERO",
          data: `M ${centerX - 4} ${centerY} L ${centerX - 1} ${centerY + 3} L ${centerX + 4} ${centerY - 2}`,
        },
      ];
      checkPath.fills = [];
      checkPath.strokes = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      checkPath.strokeWeight = 2;
      checkPath.strokeCap = "ROUND";
      checkPath.strokeJoin = "ROUND";

      iconFrame.appendChild(circle);
      iconFrame.appendChild(checkPath);
      iconNode = iconFrame;
    } else {
      // Error icon: circle dengan tanda seru (titik di atas, garis di bawah)
      const iconFrame = figma.createFrame();
      iconFrame.name = "Icon";
      iconFrame.resize(iconSizeValue, iconSizeValue);
      iconFrame.fills = [];

      // Circle
      const circle = figma.createEllipse();
      circle.resize(iconSizeValue, iconSizeValue);
      circle.fills = [];
      circle.strokes = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      circle.strokeWeight = 2;

      // Titik di atas (rectangle kecil)
      const dot = figma.createRectangle();
      dot.resize(2, 2);
      dot.x = iconSizeValue / 2 - 1;
      dot.y = iconSizeValue / 2 - 6;
      dot.fills = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      dot.cornerRadius = 1;

      // Garis vertikal di bawah (rectangle tipis)
      const line = figma.createRectangle();
      line.resize(2, 4);
      line.x = iconSizeValue / 2 - 1;
      line.y = iconSizeValue / 2 + 2;
      line.fills = [{ type: "SOLID", color: hexToRgb(finalIconColor) }];
      line.cornerRadius = 0;

      iconFrame.appendChild(circle);
      iconFrame.appendChild(dot);
      iconFrame.appendChild(line);
      iconNode = iconFrame;
    }

    // Set icon constraints
    iconNode.constraints = { horizontal: "MIN", vertical: "MIN" };
    component.appendChild(iconNode);

    // Buat frame untuk content (title + message)
    const contentFrame = figma.createFrame();
    contentFrame.name = "Content";
    contentFrame.layoutMode = "VERTICAL";
    contentFrame.counterAxisSizingMode = "AUTO";
    contentFrame.primaryAxisSizingMode = "AUTO";
    contentFrame.itemSpacing = 4; // space-y-1
    contentFrame.fills = [];
    contentFrame.paddingLeft = 0;
    contentFrame.paddingRight = 0;
    contentFrame.paddingTop = 0;
    contentFrame.paddingBottom = 0;

    // Buat title text
    const titleText = figma.createText();
    titleText.characters = title;
    titleText.fontName = { family: "Inter", style: "Medium" };
    titleText.fontSize = titleFontSizeValue;
    titleText.fills = [{ type: "SOLID", color: hexToRgb(finalTitleColor) }];
    titleText.name = "Title";
    titleText.layoutAlign = "INHERIT";
    titleText.constraints = { horizontal: "MIN", vertical: "MIN" };
    titleText.layoutPositioning = "AUTO";

    // Buat message text
    const messageText = figma.createText();
    messageText.characters = message;
    messageText.fontName = { family: "Inter", style: "Regular" };
    messageText.fontSize = messageFontSizeValue;
    messageText.fills = [{ type: "SOLID", color: hexToRgb(finalMessageColor) }];
    messageText.name = "Message";
    messageText.layoutAlign = "INHERIT";
    messageText.constraints = { horizontal: "MIN", vertical: "MIN" };
    messageText.layoutPositioning = "AUTO";

    contentFrame.appendChild(titleText);
    contentFrame.appendChild(messageText);
    component.appendChild(contentFrame);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("alertBannerProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("alertType", alertType);
    component.setPluginData("title", title);
    component.setPluginData("message", message);
    component.setPluginData("borderRadius", borderRadius);
    component.setPluginData("width", width || "");
    component.setPluginData("height", height || "");
    component.setPluginData("padding", padding || "");
    component.setPluginData("iconSize", iconSize || "");
    component.setPluginData("titleFontSize", titleFontSize || "");
    component.setPluginData("titleColor", titleColor || "");
    component.setPluginData("messageFontSize", messageFontSize || "");
    component.setPluginData("messageColor", messageColor || "");
    component.setPluginData("borderWidth", borderWidth || "");
    component.setPluginData("borderColor", borderColor || "");
    component.setPluginData("bgColor", bgColor || "");
    component.setPluginData("hoverBgColor", hoverBgColor || "");
    component.setPluginData("hoverBorderColor", hoverBorderColor || "");
    component.setPluginData("focusRingWidth", focusRingWidth || "");
    component.setPluginData("focusRingColor", focusRingColor || "");
    component.setPluginData("transitionType", transitionType || "");

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Alert Banner berhasil dibuat!`);
  });

  // Fungsi bantu konversi HEX ke RGB Figma
  function hexToRgb(hex: string) {
    let c = hex.replace("#", "");
    if (c.length === 3)
      c = c
        .split("")
        .map(x => x + x)
        .join("");
    const num = parseInt(c, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255,
    };
  }

  showUI({ width: 1200, height: 600 });
}
