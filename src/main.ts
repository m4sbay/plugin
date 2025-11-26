import { once, on, showUI, emit } from "@create-figma-plugin/utilities";
import {
  CloseHandler,
  CreateButtonHandler,
  SelectionChangeHandler,
  CreateTabsHandler,
  CreateSwitchHandler,
  CreateAlertBannerHandler,
  CreateTooltipHandler,
  CreateProgressIndicatorHandler,
  CreateDataTableHandler,
  CreateRadioButtonHandler,
} from "./types/types";
import { VerticalSpace } from "@create-figma-plugin/ui";

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
  on<CreateButtonHandler>(
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
      hoverScaleDuration,
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
      component.name = "Button";
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
      }

      const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
      component.setPluginData("id", componentId);
      component.setPluginData("htmltailwind", htmltailwind);

      // Store all styling data for reloading
      component.setPluginData("color", color || "");
      component.setPluginData("label", label || "");
      component.setPluginData("borderRadius", borderRadius?.toString() || "");
      component.setPluginData("fontSize", fontSize?.toString() || "");
      component.setPluginData("padding", padding || "");
      component.setPluginData("labelColor", labelColor || "");
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
      // Only save if value exists and is not null/undefined
      if (hoverOpacity !== undefined && hoverOpacity !== null) {
        component.setPluginData("hoverOpacity", hoverOpacity.toString());
      }
      if (hoverScale !== undefined && hoverScale !== null) {
        component.setPluginData("hoverScale", hoverScale.toString());
      }
      if (hoverScaleDuration !== undefined && hoverScaleDuration !== null) {
        component.setPluginData("hoverScaleDuration", hoverScaleDuration.toString());
      }
      if (hoverTranslateX !== undefined && hoverTranslateX !== null) {
        component.setPluginData("hoverTranslateX", hoverTranslateX.toString());
      }
      if (hoverRotate !== undefined && hoverRotate !== null) {
        component.setPluginData("hoverRotate", hoverRotate.toString());
      }

      component.appendChild(text);

      figma.currentPage.appendChild(component);
      figma.currentPage.selection = [component];
      figma.viewport.scrollAndZoomIntoView([component]);
      figma.notify("✅ Button berhasil dibuat!");
    }
  );

  on<SelectionChangeHandler>("SELECTION_CHANGE", () => {
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const selectedNode = selection[0];
      const htmltailwind = selectedNode.getPluginData("htmltailwind");

      // Check if this is a button component
      if (htmltailwind && selectedNode.name === "Button") {
        // Get all stored data
        const buttonData = {
          htmltailwind: htmltailwind,
          color: selectedNode.getPluginData("color") || "",
          label: selectedNode.getPluginData("label") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          hoverTextColor: selectedNode.getPluginData("hoverTextColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          focusBorderColor: selectedNode.getPluginData("focusBorderColor") || "",
          focusRingSize: selectedNode.getPluginData("focusRingSize") || "",
          activeBgColor: selectedNode.getPluginData("activeBgColor") || "",
          activeShadowSize: selectedNode.getPluginData("activeShadowSize") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
          transitionEasing: selectedNode.getPluginData("transitionEasing") || "",
          transitionDelay: selectedNode.getPluginData("transitionDelay") || "",
          hoverScaleType: selectedNode.getPluginData("hoverScaleType") || "",
          hoverOpacity: selectedNode.getPluginData("hoverOpacity") || undefined,
          hoverScale: selectedNode.getPluginData("hoverScale") || undefined,
          hoverScaleDuration: selectedNode.getPluginData("hoverScaleDuration") || undefined,
          hoverTranslateX: selectedNode.getPluginData("hoverTranslateX") || undefined,
          hoverRotate: selectedNode.getPluginData("hoverRotate") || undefined,
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(buttonData));
      } else if (htmltailwind && selectedNode.name === "Checkbox") {
        // Get all stored checkbox data
        const checkboxData = {
          htmltailwind: htmltailwind,
          headingLabel: selectedNode.getPluginData("headingLabel") || "",
          headingFontSize: selectedNode.getPluginData("headingFontSize") || "",
          headingColor: selectedNode.getPluginData("headingColor") || "",
          checkboxLabel: selectedNode.getPluginData("checkboxLabel") || "",
          checkboxCount: selectedNode.getPluginData("checkboxCount") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          checkboxSize: selectedNode.getPluginData("checkboxSize") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          checkedBgColor: selectedNode.getPluginData("checkedBgColor") || "",
          checkedBorderColor: selectedNode.getPluginData("checkedBorderColor") || "",
          uncheckedBgColor: selectedNode.getPluginData("uncheckedBgColor") || "",
          gapBetweenCheckboxLabel: selectedNode.getPluginData("gapBetweenCheckboxLabel") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(checkboxData));
      } else if (htmltailwind && selectedNode.name === "Radio Button") {
        const radioData = {
          componentType: "radio-button",
          htmltailwind: htmltailwind,
          headingLabel: selectedNode.getPluginData("headingLabel") || "",
          headingFontSize: selectedNode.getPluginData("headingFontSize") || "",
          headingColor: selectedNode.getPluginData("headingColor") || "",
          radioLabels: selectedNode.getPluginData("radioLabels") || "",
          radioCount: selectedNode.getPluginData("radioCount") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          checkedColor: selectedNode.getPluginData("checkedColor") || "",
          layoutDirection: selectedNode.getPluginData("layoutDirection") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(radioData));
      } else if (htmltailwind && selectedNode.name === "Text Field") {
        // Get all stored text field data
        const textFieldData = {
          htmltailwind: htmltailwind,
          label: selectedNode.getPluginData("label") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || selectedNode.getPluginData("fontSize") || "",
          placeholder: selectedNode.getPluginData("placeholder") || "",
          width: selectedNode.getPluginData("width") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          outlineColor: selectedNode.getPluginData("outlineColor") || "",
          inputPadding: selectedNode.getPluginData("inputPadding") || "",
          wrapperPadding: selectedNode.getPluginData("wrapperPadding") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || selectedNode.getPluginData("ringColor") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(textFieldData));
      } else if (htmltailwind && selectedNode.name === "Progress Indicator") {
        const progressData = {
          componentType: "progress-indicator",
          htmltailwind: htmltailwind,
          progressValue: selectedNode.getPluginData("progressValue") || "",
          progressType: selectedNode.getPluginData("progressType") || "",
          width: selectedNode.getPluginData("width") || "",
          height: selectedNode.getPluginData("height") || "",
          progressColor: selectedNode.getPluginData("progressColor") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          percentageTextColor: selectedNode.getPluginData("percentageTextColor") || "",
          percentageMargin: selectedNode.getPluginData("percentageMargin") || "",
          showPercentage: selectedNode.getPluginData("showPercentage") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(progressData));
      } else if (htmltailwind && selectedNode.name === "Data Table") {
        const dataTableData = {
          componentType: "data-table",
          htmltailwind: htmltailwind,
          columns: selectedNode.getPluginData("columns") || "",
          rows: selectedNode.getPluginData("rows") || "",
          headerBgColor: selectedNode.getPluginData("headerBgColor") || "",
          headerTextColor: selectedNode.getPluginData("headerTextColor") || "",
          rowBgColor: selectedNode.getPluginData("rowBgColor") || "",
          stripedRowBgColor: selectedNode.getPluginData("stripedRowBgColor") || "",
          rowTextColor: selectedNode.getPluginData("rowTextColor") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          stripedRows: selectedNode.getPluginData("stripedRows") || "",
          textAlignment: selectedNode.getPluginData("textAlignment") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(dataTableData));
      } else if (htmltailwind && selectedNode.name === "Tooltip") {
        const tooltipData = {
          componentType: "tooltip",
          htmltailwind: htmltailwind,
          tooltipText: selectedNode.getPluginData("tooltipText") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          textColor: selectedNode.getPluginData("textColor") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          marginBottom: selectedNode.getPluginData("marginBottom") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(tooltipData));
      } else if (htmltailwind && selectedNode.name === "Alert Banner") {
        const alertBannerData = {
          componentType: "alert-banner",
          htmltailwind: htmltailwind,
          alertType: selectedNode.getPluginData("alertType") || "",
          title: selectedNode.getPluginData("title") || "",
          message: selectedNode.getPluginData("message") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          width: selectedNode.getPluginData("width") || "",
          height: selectedNode.getPluginData("height") || "",
          padding: selectedNode.getPluginData("padding") || "",
          iconSize: selectedNode.getPluginData("iconSize") || "",
          titleFontSize: selectedNode.getPluginData("titleFontSize") || "",
          titleColor: selectedNode.getPluginData("titleColor") || "",
          messageFontSize: selectedNode.getPluginData("messageFontSize") || "",
          messageColor: selectedNode.getPluginData("messageColor") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(alertBannerData));
      } else if (htmltailwind && selectedNode.name === "Switch") {
        const switchData = {
          componentType: "switch",
          htmltailwind: htmltailwind,
          switchCount: selectedNode.getPluginData("switchCount") || "",
          switchLabels: selectedNode.getPluginData("switchLabels") || "",
          containerWidth: selectedNode.getPluginData("containerWidth") || "",
          headlineText: selectedNode.getPluginData("headlineText") || "",
          headlineColor: selectedNode.getPluginData("headlineColor") || "",
          headlineFontSize: selectedNode.getPluginData("headlineFontSize") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          switchWidth: selectedNode.getPluginData("switchWidth") || "",
          switchHeight: selectedNode.getPluginData("switchHeight") || "",
          toggleSize: selectedNode.getPluginData("toggleSize") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          uncheckedBorderColor: selectedNode.getPluginData("uncheckedBorderColor") || "",
          uncheckedBgColor: selectedNode.getPluginData("uncheckedBgColor") || "",
          checkedBorderColor: selectedNode.getPluginData("checkedBorderColor") || "",
          checkedBgColor: selectedNode.getPluginData("checkedBgColor") || "",
          toggleBgColor: selectedNode.getPluginData("toggleBgColor") || "",
          defaultCheckedStates: selectedNode.getPluginData("defaultCheckedStates") || "",
          disabledStates: selectedNode.getPluginData("disabledStates") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(switchData));
      } else if (htmltailwind && selectedNode.name === "Tabs") {
        const tabsData = {
          componentType: "tabs",
          htmltailwind: htmltailwind,
          tabCount: selectedNode.getPluginData("tabCount") || "",
          tabLabels: selectedNode.getPluginData("tabLabels") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          containerBgColor: selectedNode.getPluginData("containerBgColor") || "",
          activeBgColor: selectedNode.getPluginData("activeBgColor") || "",
          activeTextColor: selectedNode.getPluginData("activeTextColor") || "",
          inactiveTextColor: selectedNode.getPluginData("inactiveTextColor") || "",
          tabPadding: selectedNode.getPluginData("tabPadding") || "",
          tabBorderRadius: selectedNode.getPluginData("tabBorderRadius") || "",
          tabGap: selectedNode.getPluginData("tabGap") || "",
          containerPadding: selectedNode.getPluginData("containerPadding") || "",
          panelContents: selectedNode.getPluginData("panelContents") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
          tabsWidth: selectedNode.getPluginData("tabsWidth") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(tabsData));
      } else {
        emit<SelectionChangeHandler>("SELECTION_CHANGE", htmltailwind || "");
      }
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

      // Check if this is a button component
      if (htmltailwind && selectedNode.name === "Button") {
        // Get all stored data
        const buttonData = {
          htmltailwind: htmltailwind,
          color: selectedNode.getPluginData("color") || "",
          label: selectedNode.getPluginData("label") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          hoverTextColor: selectedNode.getPluginData("hoverTextColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          focusBorderColor: selectedNode.getPluginData("focusBorderColor") || "",
          focusRingSize: selectedNode.getPluginData("focusRingSize") || "",
          activeBgColor: selectedNode.getPluginData("activeBgColor") || "",
          activeShadowSize: selectedNode.getPluginData("activeShadowSize") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
          transitionEasing: selectedNode.getPluginData("transitionEasing") || "",
          transitionDelay: selectedNode.getPluginData("transitionDelay") || "",
          hoverScaleType: selectedNode.getPluginData("hoverScaleType") || "",
          hoverOpacity: selectedNode.getPluginData("hoverOpacity") || undefined,
          hoverScale: selectedNode.getPluginData("hoverScale") || undefined,
          hoverScaleDuration: selectedNode.getPluginData("hoverScaleDuration") || undefined,
          hoverTranslateX: selectedNode.getPluginData("hoverTranslateX") || undefined,
          hoverRotate: selectedNode.getPluginData("hoverRotate") || undefined,
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(buttonData));
      } else if (htmltailwind && selectedNode.name === "Checkbox") {
        // Get all stored checkbox data
        const checkboxData = {
          htmltailwind: htmltailwind,
          headingLabel: selectedNode.getPluginData("headingLabel") || "",
          headingFontSize: selectedNode.getPluginData("headingFontSize") || "",
          headingColor: selectedNode.getPluginData("headingColor") || "",
          checkboxLabel: selectedNode.getPluginData("checkboxLabel") || "",
          checkboxCount: selectedNode.getPluginData("checkboxCount") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          checkboxSize: selectedNode.getPluginData("checkboxSize") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          checkedBgColor: selectedNode.getPluginData("checkedBgColor") || "",
          checkedBorderColor: selectedNode.getPluginData("checkedBorderColor") || "",
          uncheckedBgColor: selectedNode.getPluginData("uncheckedBgColor") || "",
          gapBetweenCheckboxLabel: selectedNode.getPluginData("gapBetweenCheckboxLabel") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(checkboxData));
      } else if (htmltailwind && selectedNode.name === "Radio Button") {
        const radioData = {
          componentType: "radio-button",
          htmltailwind: htmltailwind,
          headingLabel: selectedNode.getPluginData("headingLabel") || "",
          headingFontSize: selectedNode.getPluginData("headingFontSize") || "",
          headingColor: selectedNode.getPluginData("headingColor") || "",
          radioLabels: selectedNode.getPluginData("radioLabels") || "",
          radioCount: selectedNode.getPluginData("radioCount") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          checkedColor: selectedNode.getPluginData("checkedColor") || "",
          layoutDirection: selectedNode.getPluginData("layoutDirection") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(radioData));
      } else if (htmltailwind && selectedNode.name === "Text Field") {
        // Get all stored text field data
        const textFieldData = {
          htmltailwind: htmltailwind,
          label: selectedNode.getPluginData("label") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || selectedNode.getPluginData("fontSize") || "",
          placeholder: selectedNode.getPluginData("placeholder") || "",
          width: selectedNode.getPluginData("width") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          outlineColor: selectedNode.getPluginData("outlineColor") || "",
          inputPadding: selectedNode.getPluginData("inputPadding") || "",
          wrapperPadding: selectedNode.getPluginData("wrapperPadding") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || selectedNode.getPluginData("ringColor") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(textFieldData));
      } else if (htmltailwind && selectedNode.name === "Progress Indicator") {
        const progressData = {
          componentType: "progress-indicator",
          htmltailwind: htmltailwind,
          progressValue: selectedNode.getPluginData("progressValue") || "",
          progressType: selectedNode.getPluginData("progressType") || "",
          width: selectedNode.getPluginData("width") || "",
          height: selectedNode.getPluginData("height") || "",
          progressColor: selectedNode.getPluginData("progressColor") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          percentageTextColor: selectedNode.getPluginData("percentageTextColor") || "",
          percentageMargin: selectedNode.getPluginData("percentageMargin") || "",
          showPercentage: selectedNode.getPluginData("showPercentage") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(progressData));
      } else if (htmltailwind && selectedNode.name === "Data Table") {
        const dataTableData = {
          componentType: "data-table",
          htmltailwind: htmltailwind,
          columns: selectedNode.getPluginData("columns") || "",
          rows: selectedNode.getPluginData("rows") || "",
          headerBgColor: selectedNode.getPluginData("headerBgColor") || "",
          headerTextColor: selectedNode.getPluginData("headerTextColor") || "",
          rowBgColor: selectedNode.getPluginData("rowBgColor") || "",
          stripedRowBgColor: selectedNode.getPluginData("stripedRowBgColor") || "",
          rowTextColor: selectedNode.getPluginData("rowTextColor") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          stripedRows: selectedNode.getPluginData("stripedRows") || "",
          textAlignment: selectedNode.getPluginData("textAlignment") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(dataTableData));
      } else if (htmltailwind && selectedNode.name === "Tooltip") {
        const tooltipData = {
          componentType: "tooltip",
          htmltailwind: htmltailwind,
          tooltipText: selectedNode.getPluginData("tooltipText") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          textColor: selectedNode.getPluginData("textColor") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          padding: selectedNode.getPluginData("padding") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          marginBottom: selectedNode.getPluginData("marginBottom") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(tooltipData));
      } else if (htmltailwind && selectedNode.name === "Alert Banner") {
        const alertBannerData = {
          componentType: "alert-banner",
          htmltailwind: htmltailwind,
          alertType: selectedNode.getPluginData("alertType") || "",
          title: selectedNode.getPluginData("title") || "",
          message: selectedNode.getPluginData("message") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          width: selectedNode.getPluginData("width") || "",
          height: selectedNode.getPluginData("height") || "",
          padding: selectedNode.getPluginData("padding") || "",
          iconSize: selectedNode.getPluginData("iconSize") || "",
          titleFontSize: selectedNode.getPluginData("titleFontSize") || "",
          titleColor: selectedNode.getPluginData("titleColor") || "",
          messageFontSize: selectedNode.getPluginData("messageFontSize") || "",
          messageColor: selectedNode.getPluginData("messageColor") || "",
          borderWidth: selectedNode.getPluginData("borderWidth") || "",
          borderColor: selectedNode.getPluginData("borderColor") || "",
          bgColor: selectedNode.getPluginData("bgColor") || "",
          hoverBgColor: selectedNode.getPluginData("hoverBgColor") || "",
          hoverBorderColor: selectedNode.getPluginData("hoverBorderColor") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(alertBannerData));
      } else if (htmltailwind && selectedNode.name === "Switch") {
        const switchData = {
          componentType: "switch",
          htmltailwind: htmltailwind,
          switchCount: selectedNode.getPluginData("switchCount") || "",
          switchLabels: selectedNode.getPluginData("switchLabels") || "",
          containerWidth: selectedNode.getPluginData("containerWidth") || "",
          headlineText: selectedNode.getPluginData("headlineText") || "",
          headlineColor: selectedNode.getPluginData("headlineColor") || "",
          headlineFontSize: selectedNode.getPluginData("headlineFontSize") || "",
          labelColor: selectedNode.getPluginData("labelColor") || "",
          labelFontSize: selectedNode.getPluginData("labelFontSize") || "",
          switchWidth: selectedNode.getPluginData("switchWidth") || "",
          switchHeight: selectedNode.getPluginData("switchHeight") || "",
          toggleSize: selectedNode.getPluginData("toggleSize") || "",
          borderRadius: selectedNode.getPluginData("borderRadius") || "",
          uncheckedBorderColor: selectedNode.getPluginData("uncheckedBorderColor") || "",
          uncheckedBgColor: selectedNode.getPluginData("uncheckedBgColor") || "",
          checkedBorderColor: selectedNode.getPluginData("checkedBorderColor") || "",
          checkedBgColor: selectedNode.getPluginData("checkedBgColor") || "",
          toggleBgColor: selectedNode.getPluginData("toggleBgColor") || "",
          defaultCheckedStates: selectedNode.getPluginData("defaultCheckedStates") || "",
          disabledStates: selectedNode.getPluginData("disabledStates") || "",
          focusRingWidth: selectedNode.getPluginData("focusRingWidth") || "",
          focusRingColor: selectedNode.getPluginData("focusRingColor") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(switchData));
      } else if (htmltailwind && selectedNode.name === "Tabs") {
        const tabsData = {
          componentType: "tabs",
          htmltailwind: htmltailwind,
          tabCount: selectedNode.getPluginData("tabCount") || "",
          tabLabels: selectedNode.getPluginData("tabLabels") || "",
          fontSize: selectedNode.getPluginData("fontSize") || "",
          containerBgColor: selectedNode.getPluginData("containerBgColor") || "",
          activeBgColor: selectedNode.getPluginData("activeBgColor") || "",
          activeTextColor: selectedNode.getPluginData("activeTextColor") || "",
          inactiveTextColor: selectedNode.getPluginData("inactiveTextColor") || "",
          tabPadding: selectedNode.getPluginData("tabPadding") || "",
          tabBorderRadius: selectedNode.getPluginData("tabBorderRadius") || "",
          tabGap: selectedNode.getPluginData("tabGap") || "",
          containerPadding: selectedNode.getPluginData("containerPadding") || "",
          panelContents: selectedNode.getPluginData("panelContents") || "",
          transitionType: selectedNode.getPluginData("transitionType") || "",
          tabsWidth: selectedNode.getPluginData("tabsWidth") || "",
        };
        emit<SelectionChangeHandler>("SELECTION_CHANGE", JSON.stringify(tabsData));
      } else {
        emit<SelectionChangeHandler>("SELECTION_CHANGE", htmltailwind || "");
      }
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
    component.setPluginData("gapBetweenCheckboxLabel", gapBetweenCheckboxLabel);
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
      // Gunakan fontSize (yang sebenarnya labelFontSize dari TextFieldCreator)
      labelText.fontSize = Number(fontSize) || 14;
      labelText.fills = [{ type: "SOLID", color: hexToRgb(labelColor || "#111827") }];
      labelText.name = "Label";
      component.appendChild(labelText);
    }

    // Parse width untuk wrapper frame
    let wrapperWidth: number | undefined = undefined;
    if (width) {
      const widthMatch = width.match(/(\d+)/);
      if (widthMatch) wrapperWidth = Number(widthMatch[1]);
    }

    // Parse padding untuk input field
    // Format padding: "wrapperPadding,inputPadding" dari TextFieldCreator
    // wrapperPadding untuk paddingLeft, inputPadding untuk paddingTop/Bottom
    let paddingLeft = 12; // default wrapperPadding
    let paddingRight = 0;
    let paddingTop = 6; // default inputPadding
    let paddingBottom = 6; // default inputPadding

    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => parseInt(val.trim().replace("px", ""), 10));
      if (paddingValues.length >= 2 && !isNaN(paddingValues[0]) && !isNaN(paddingValues[1])) {
        // paddingValues[0] = wrapperPadding (untuk paddingLeft)
        // paddingValues[1] = inputPadding (untuk paddingTop dan Bottom)
        paddingLeft = paddingValues[0];
        paddingTop = paddingValues[1];
        paddingBottom = paddingValues[1];
        paddingRight = paddingValues[1]; // pr dari input padding
      } else if (paddingValues.length >= 1 && !isNaN(paddingValues[0])) {
        // Fallback jika hanya satu nilai
        paddingTop = paddingValues[0];
        paddingBottom = paddingValues[0];
        paddingLeft = paddingValues[0] * 2;
        paddingRight = paddingValues[0] * 2;
      }
    }

    // Buat wrapper frame (sesuai struktur HTML dengan wrapper div)
    const wrapperFrame = figma.createFrame();
    wrapperFrame.name = "Input Wrapper";
    wrapperFrame.layoutMode = "HORIZONTAL";
    if (wrapperWidth) {
      wrapperFrame.counterAxisSizingMode = "FIXED";
      wrapperFrame.primaryAxisSizingMode = "FIXED";
      wrapperFrame.resize(wrapperWidth, 40); // Default height 40
    } else {
      wrapperFrame.counterAxisSizingMode = "AUTO";
      wrapperFrame.primaryAxisSizingMode = "AUTO";
    }
    wrapperFrame.primaryAxisAlignItems = "MIN";
    wrapperFrame.counterAxisAlignItems = "CENTER";
    wrapperFrame.paddingLeft = paddingLeft; // wrapperPadding
    wrapperFrame.paddingRight = 0;
    wrapperFrame.paddingTop = 0;
    wrapperFrame.paddingBottom = 0;
    wrapperFrame.fills = [{ type: "SOLID", color: hexToRgb(bgColor || "#FFFFFF") }];
    wrapperFrame.cornerRadius = Number(borderRadius) || 6;

    // Set outline/border pada wrapper (sesuai struktur HTML)
    if (outlineWidth && Number(outlineWidth) > 0) {
      wrapperFrame.strokes = [{ type: "SOLID", color: hexToRgb(outlineColor || "#D1D5DB") }];
      wrapperFrame.strokeWeight = Number(outlineWidth);
    }

    // Buat frame untuk input field di dalam wrapper
    const inputFrame = figma.createFrame();
    inputFrame.name = "Input Field";
    inputFrame.layoutMode = "HORIZONTAL";
    inputFrame.counterAxisSizingMode = "AUTO";
    inputFrame.primaryAxisSizingMode = "AUTO";
    inputFrame.primaryAxisAlignItems = "MIN";
    inputFrame.counterAxisAlignItems = "CENTER";
    inputFrame.paddingLeft = paddingRight; // pr dari input padding
    inputFrame.paddingRight = paddingRight;
    inputFrame.paddingTop = paddingTop;
    inputFrame.paddingBottom = paddingBottom;
    inputFrame.fills = [];

    // Buat placeholder text di dalam input frame (jika ada placeholder)
    if (placeholder) {
      const placeholderText = figma.createText();
      placeholderText.characters = placeholder;
      placeholderText.fontName = { family: "Inter", style: "Regular" };
      // Gunakan fontSize (labelFontSize) untuk placeholder juga
      placeholderText.fontSize = Number(fontSize) || 14;
      placeholderText.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.5 }]; // Gray dengan opacity untuk placeholder
      placeholderText.name = "Placeholder";
      placeholderText.layoutAlign = "INHERIT";
      placeholderText.constraints = { horizontal: "MIN", vertical: "MIN" };
      placeholderText.layoutPositioning = "AUTO";
      inputFrame.appendChild(placeholderText);
    }

    // Set shadow effect pada wrapper jika ada
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
      wrapperFrame.effects = effects;
    }

    // Susun struktur: wrapper -> input frame -> placeholder text
    wrapperFrame.appendChild(inputFrame);

    // Tambahkan wrapper frame ke component
    component.appendChild(wrapperFrame);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");

    // Store semua styling data
    component.setPluginData("label", label || "");
    component.setPluginData("labelColor", labelColor || "");
    component.setPluginData("fontSize", fontSize || "");
    component.setPluginData("labelFontSize", fontSize || ""); // Alias untuk kompatibilitas
    component.setPluginData("placeholder", placeholder || "");
    component.setPluginData("width", width || "");
    // Simpan width untuk reload
    component.setPluginData("height", height || "");
    component.setPluginData("bgColor", bgColor || "");
    component.setPluginData("borderRadius", borderRadius || "");
    component.setPluginData("outlineWidth", outlineWidth || "");
    component.setPluginData("outlineColor", outlineColor || "");
    component.setPluginData("padding", padding || "");
    // Parse padding untuk menyimpan inputPadding dan wrapperPadding
    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => val.trim().replace("px", ""));
      const wrapperPaddingValue = paddingValues[0];
      const inputPaddingValue = paddingValues[1];

      if (wrapperPaddingValue && !isNaN(Number(wrapperPaddingValue))) {
        component.setPluginData("wrapperPadding", wrapperPaddingValue);
      } else {
        component.setPluginData("wrapperPadding", "12");
      }

      if (inputPaddingValue && !isNaN(Number(inputPaddingValue))) {
        component.setPluginData("inputPadding", inputPaddingValue);
      } else if (wrapperPaddingValue && !isNaN(Number(wrapperPaddingValue))) {
        component.setPluginData("inputPadding", wrapperPaddingValue);
      } else {
        component.setPluginData("inputPadding", "6");
      }
    } else {
      component.setPluginData("wrapperPadding", "12");
      component.setPluginData("inputPadding", "6");
    }
    component.setPluginData("shadow", shadow || "");
    component.setPluginData("hoverBgColor", hoverBgColor || "");
    component.setPluginData("activeRingWidth", activeRingWidth || "");
    component.setPluginData("ringColor", ringColor || "");
    component.setPluginData("focusRingColor", ringColor || ""); // Alias untuk kompatibilitas
    component.setPluginData("transitionType", transitionType || "");
    component.setPluginData("labelGap", labelGap || "8");

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify("✅ Text Field berhasil dibuat!");
  });

  on<CreateTooltipHandler>("CREATE_TOOLTIP", async props => {
    const { tooltipText, bgColor, textColor, fontSize, padding, borderRadius, marginBottom, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter Regular': " + error);
      return;
    }

    // Parse values
    const fontSizeValue = Number(fontSize.replace(/px/gi, "").trim()) || 14;
    const paddingY = padding.split(",")[0]?.trim().replace(/px/gi, "") || "8";
    const paddingX = padding.split(",")[1]?.trim().replace(/px/gi, "") || "12";
    const paddingXValue = Number(paddingX) || 12;
    const paddingYValue = Number(paddingY) || 8;
    const borderRadiusValue = Number(borderRadius.replace(/px/gi, "").trim()) || 8;
    const marginBottomValue = Number(marginBottom.replace(/px/gi, "").trim()) || 16;

    // Buat komponen tooltip
    const component = figma.createComponent();
    component.name = "Tooltip";
    component.layoutMode = "NONE"; // Tidak menggunakan layout mode agar bisa absolute positioning
    component.fills = [];

    // Buat tooltip frame
    const tooltipFrame = figma.createFrame();
    tooltipFrame.name = "Tooltip";
    tooltipFrame.layoutMode = "HORIZONTAL";
    tooltipFrame.counterAxisSizingMode = "AUTO";
    tooltipFrame.primaryAxisSizingMode = "AUTO";
    tooltipFrame.primaryAxisAlignItems = "CENTER";
    tooltipFrame.counterAxisAlignItems = "CENTER";
    tooltipFrame.paddingLeft = paddingXValue;
    tooltipFrame.paddingRight = paddingXValue;
    tooltipFrame.paddingTop = paddingYValue;
    tooltipFrame.paddingBottom = paddingYValue;
    tooltipFrame.cornerRadius = borderRadiusValue;
    tooltipFrame.fills = [{ type: "SOLID", color: hexToRgb(bgColor || "#111827") }];
    tooltipFrame.itemSpacing = 0;
    tooltipFrame.x = 0;
    tooltipFrame.y = 0;

    // Buat text node untuk tooltip
    const tooltipTextNode = figma.createText();
    tooltipTextNode.characters = tooltipText || "Click Me";
    tooltipTextNode.fontName = { family: "Inter", style: "Regular" };
    tooltipTextNode.fontSize = fontSizeValue;
    tooltipTextNode.fills = [{ type: "SOLID", color: hexToRgb(textColor || "#FFFFFF") }];
    tooltipTextNode.layoutAlign = "INHERIT";
    tooltipTextNode.constraints = { horizontal: "MIN", vertical: "MIN" };
    tooltipTextNode.layoutPositioning = "AUTO";

    tooltipFrame.appendChild(tooltipTextNode);
    component.appendChild(tooltipFrame);

    // Buat arrow tooltip (kotak kecil yang di-rotate 45 derajat)
    const arrowFrame = figma.createFrame();
    arrowFrame.name = "Arrow";
    arrowFrame.resize(8, 8);
    arrowFrame.fills = [{ type: "SOLID", color: hexToRgb(bgColor || "#111827") }];
    arrowFrame.cornerRadius = 0;
    arrowFrame.rotation = 45; // Rotate 45 derajat
    // Posisi arrow: center horizontal, di bawah tooltip dengan offset -4px
    arrowFrame.x = tooltipFrame.width / 2 - 4; // Center horizontally
    arrowFrame.y = tooltipFrame.height - 2; // Di bawah tooltip, offset -4px untuk overlap

    // Tambahkan arrow sebagai sibling dari tooltipFrame
    component.appendChild(arrowFrame);

    // Resize component agar sesuai dengan ukuran tooltipFrame + arrow
    // Hitung bounds dari semua child untuk mendapatkan ukuran yang tepat
    const componentWidth = tooltipFrame.width;
    // Arrow berada di y = tooltipFrame.height - 2, dengan tinggi 8px
    // Jadi arrow bottom = (tooltipFrame.height - 2) + 8 = tooltipFrame.height + 6
    const arrowBottom = arrowFrame.y + arrowFrame.height;
    const componentHeight = Math.max(tooltipFrame.height, arrowBottom);

    component.resize(componentWidth, componentHeight);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("tooltipText", tooltipText || "");
    component.setPluginData("bgColor", bgColor || "#111827");
    component.setPluginData("textColor", textColor || "#FFFFFF");
    component.setPluginData("fontSize", fontSize || "14");
    component.setPluginData("padding", padding || "8,12");
    component.setPluginData("borderRadius", borderRadius || "8");
    component.setPluginData("marginBottom", marginBottom || "16");

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
            titleColor: "#1E3A8A", // blue-900
            messageColor: "#1E40AF", // blue-800
          };
        case "success":
          return {
            border: "#BBF7D0", // green-200
            bg: "#F0FDF4", // green-50
            titleColor: "#14532D", // green-900
            messageColor: "#166534", // green-800
          };
        case "error":
          return {
            border: "#FECACA", // red-200
            bg: "#FEF2F2", // red-50
            titleColor: "#7F1D1D", // red-900
            messageColor: "#991B1B", // red-800
          };
        default:
          return {
            border: "#BFDBFE",
            bg: "#EFF6FF",
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

    const borderRadiusValue = Number(borderRadius) || 6;
    const paddingValue = Number(padding) || 16;
    const borderWidthValue = Number(borderWidth) || 1;
    const titleFontSizeValue = Number(titleFontSize) || 14;
    const messageFontSizeValue = Number(messageFontSize) || 14;

    // Buat component utama
    const component = figma.createComponent();
    component.name = "Alert Banner";
    component.layoutMode = "VERTICAL";
    component.primaryAxisSizingMode = "AUTO"; // Height auto
    component.counterAxisSizingMode = width ? "FIXED" : "AUTO"; // Width fixed jika diberikan
    component.primaryAxisAlignItems = "MIN";
    component.counterAxisAlignItems = "MIN";
    component.itemSpacing = 4; // gap-1 (space-y-1)
    component.paddingLeft = paddingValue;
    component.paddingRight = paddingValue;
    component.paddingTop = paddingValue;
    component.paddingBottom = paddingValue;
    component.cornerRadius = borderRadiusValue;
    component.fills = [{ type: "SOLID", color: hexToRgb(finalBgColor) }];
    component.strokes = [{ type: "SOLID", color: hexToRgb(finalBorderColor) }];
    component.strokeWeight = borderWidthValue;

    // Buat title text
    const titleText = figma.createText();
    titleText.characters = title;
    titleText.fontName = { family: "Inter", style: "Medium" };
    titleText.fontSize = titleFontSizeValue;
    titleText.fills = [{ type: "SOLID", color: hexToRgb(finalTitleColor) }];
    titleText.name = "Title";
    titleText.layoutPositioning = "AUTO";
    titleText.layoutAlign = "STRETCH";
    titleText.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    titleText.textAutoResize = "HEIGHT";

    // Buat message text
    const messageText = figma.createText();
    messageText.characters = message;
    messageText.fontName = { family: "Inter", style: "Regular" };
    messageText.fontSize = messageFontSizeValue;
    messageText.fills = [{ type: "SOLID", color: hexToRgb(finalMessageColor) }];
    messageText.name = "Message";
    messageText.layoutPositioning = "AUTO";
    messageText.layoutAlign = "STRETCH";
    messageText.constraints = { horizontal: "STRETCH", vertical: "MIN" };
    messageText.textAutoResize = "HEIGHT";
    messageText.textAlignHorizontal = "JUSTIFIED";

    component.appendChild(titleText);
    component.appendChild(messageText);

    // Set width setelah semua children ditambahkan
    // Auto layout akan menghitung height secara otomatis
    if (width) {
      const targetWidth = Number(width);
      // Resize width, height akan dihitung otomatis oleh auto layout
      component.resize(targetWidth, component.height || 100);
    }

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

  on<CreateProgressIndicatorHandler>("CREATE_PROGRESS_INDICATOR", async props => {
    const { progressValue, progressType, width, height, progressColor, bgColor, borderRadius, percentageTextColor, percentageMargin, showPercentage, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter Regular': " + error);
      return;
    }

    // Parse values
    const progressValueNum = Number(progressValue) || 60;
    const widthValue = Number(width) || 300;
    const heightValue = Number(height) || 12;
    const borderRadiusValue = Number(borderRadius) || 9999;
    const progressRgb = hexToRgb(progressColor);
    const bgRgb = hexToRgb(bgColor);
    const percentageTextRgb = hexToRgb(percentageTextColor || "#111827");

    // Buat component utama
    const component = figma.createComponent();
    component.name = "Progress Indicator";
    component.layoutMode = "HORIZONTAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.primaryAxisAlignItems = "CENTER";
    component.counterAxisAlignItems = "CENTER";
    const marginValue = Number(percentageMargin) || 12;
    component.itemSpacing = showPercentage === "yes" ? marginValue : 0;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.fills = [];

    // Progress Bar
    const barContainer = figma.createFrame();
    barContainer.name = "Progress Bar Container";
    barContainer.layoutMode = "HORIZONTAL";
    barContainer.counterAxisSizingMode = "FIXED";
    barContainer.primaryAxisSizingMode = "FIXED";
    barContainer.resize(widthValue, heightValue);
    barContainer.cornerRadius = borderRadiusValue;
    barContainer.fills = [{ type: "SOLID", color: bgRgb }];
    barContainer.clipsContent = true;

    // Progress fill
    const progressFill = figma.createFrame();
    progressFill.name = "Progress Fill";
    progressFill.layoutMode = "HORIZONTAL";
    progressFill.counterAxisSizingMode = "FIXED";
    progressFill.primaryAxisSizingMode = "FIXED";
    const fillWidth = (widthValue * progressValueNum) / 100;
    progressFill.resize(fillWidth, heightValue);
    progressFill.cornerRadius = borderRadiusValue;
    progressFill.fills = [{ type: "SOLID", color: progressRgb }];
    progressFill.x = 0;
    progressFill.y = 0;

    barContainer.appendChild(progressFill);
    component.appendChild(barContainer);

    // Percentage text jika diperlukan
    if (showPercentage === "yes") {
      const percentageText = figma.createText();
      percentageText.characters = `${progressValue}%`;
      percentageText.fontName = { family: "Inter", style: "Regular" };
      percentageText.fontSize = 14;
      percentageText.fills = [{ type: "SOLID", color: percentageTextRgb }];
      percentageText.layoutAlign = "INHERIT";
      percentageText.constraints = { horizontal: "MIN", vertical: "MIN" };
      percentageText.layoutPositioning = "AUTO";
      component.appendChild(percentageText);
    }

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");

    // Store styling data
    component.setPluginData("progressValue", progressValue);
    component.setPluginData("progressType", progressType);
    component.setPluginData("width", width);
    component.setPluginData("height", height);
    component.setPluginData("progressColor", progressColor);
    component.setPluginData("bgColor", bgColor);
    component.setPluginData("borderRadius", borderRadius);
    component.setPluginData("percentageTextColor", percentageTextColor);
    component.setPluginData("percentageMargin", percentageMargin);
    component.setPluginData("showPercentage", showPercentage);

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Progress Indicator berhasil dibuat!`);
  });

  on<CreateDataTableHandler>("CREATE_DATA_TABLE", async props => {
    const { columns, rows, headerBgColor, headerTextColor, rowBgColor, stripedRowBgColor, rowTextColor, borderColor, fontSize, padding, stripedRows, textAlignment, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Parse values
    const columnList = columns
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);
    const rowCount = parseInt(rows) || 3;
    const fontSizeValue = Number(fontSize) || 14;

    // Parse padding
    let paddingTop = 12;
    let paddingBottom = 12;
    let paddingLeft = 16;
    let paddingRight = 16;

    if (padding) {
      const paddingValues = padding.split(",").map((val: string) => parseInt(val.trim().replace("px", ""), 10));
      if (paddingValues.length === 2 && !isNaN(paddingValues[0]) && !isNaN(paddingValues[1])) {
        paddingTop = paddingValues[0];
        paddingBottom = paddingValues[0];
        paddingLeft = paddingValues[1];
        paddingRight = paddingValues[1];
      }
    }

    // Convert colors to RGB
    const headerBgRgb = hexToRgb(headerBgColor);
    const headerTextRgb = hexToRgb(headerTextColor);
    const rowBgRgb = hexToRgb(rowBgColor);
    const stripedRowBgRgb = hexToRgb(stripedRowBgColor);
    const rowTextRgb = hexToRgb(rowTextColor);
    const borderRgb = hexToRgb(borderColor);

    // Validasi kolom
    if (columnList.length === 0) {
      figma.notify("❌ Error: Minimal harus ada 1 kolom!");
      return;
    }

    // Hitung ukuran table
    const columnWidth = 200; // Default width per column
    const totalWidth = columnList.length * columnWidth;
    const estimatedRowHeight = paddingTop + paddingBottom + fontSizeValue + 10; // Padding + font + margin
    const estimatedHeight = (rowCount + 1) * estimatedRowHeight; // +1 untuk header row

    // Buat component utama untuk table
    const component = figma.createComponent();
    component.name = "Data Table";
    component.layoutMode = "VERTICAL";
    component.counterAxisSizingMode = "AUTO"; // AUTO untuk height (akan mengikuti children)
    component.primaryAxisSizingMode = "FIXED"; // FIXED untuk width
    component.itemSpacing = 0;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.fills = [];
    component.resize(totalWidth, estimatedHeight); // Set initial size

    // Buat frame untuk header row
    const headerRow = figma.createFrame();
    headerRow.name = "Header Row";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.counterAxisSizingMode = "AUTO"; // AUTO untuk height
    headerRow.primaryAxisSizingMode = "FIXED"; // FIXED untuk width (sesuai dengan component)
    headerRow.primaryAxisAlignItems = "MIN"; // LEFT alignment seperti preview
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.itemSpacing = 0;
    headerRow.paddingLeft = 0;
    headerRow.paddingRight = 0;
    headerRow.paddingTop = 0;
    headerRow.paddingBottom = 0;
    headerRow.fills = [{ type: "SOLID", color: headerBgRgb }];
    // Border di semua sisi seperti preview
    headerRow.strokes = [{ type: "SOLID", color: borderRgb }];
    headerRow.strokeWeight = 1;
    headerRow.strokeAlign = "INSIDE";
    headerRow.resize(totalWidth, estimatedRowHeight); // Set initial size

    // Mapping untuk alignment
    const alignmentMap: { [key: string]: "MIN" | "CENTER" | "MAX" } = {
      left: "MIN",
      center: "CENTER",
      right: "MAX",
    };
    const textAlignMap: { [key: string]: "LEFT" | "CENTER" | "RIGHT" } = {
      left: "LEFT",
      center: "CENTER",
      right: "RIGHT",
    };

    // Buat header cells
    columnList.forEach((col, idx) => {
      const headerCell = figma.createFrame();
      headerCell.name = `Header ${col}`;
      headerCell.layoutMode = "VERTICAL"; // VERTICAL untuk menampung text dengan benar
      headerCell.counterAxisSizingMode = "FIXED";
      headerCell.primaryAxisSizingMode = "FIXED";
      headerCell.resize(columnWidth, estimatedRowHeight); // Set size fixed
      // Set alignment berdasarkan textAlignment
      headerCell.primaryAxisAlignItems = alignmentMap[textAlignment] || "MIN";
      headerCell.counterAxisAlignItems = "CENTER";
      headerCell.itemSpacing = 0;
      headerCell.paddingLeft = paddingLeft;
      headerCell.paddingRight = paddingRight;
      headerCell.paddingTop = paddingTop;
      headerCell.paddingBottom = paddingBottom;
      headerCell.fills = [];
      // Border di semua sisi seperti preview (border-collapse effect)
      headerCell.strokes = [{ type: "SOLID", color: borderRgb }];
      headerCell.strokeWeight = 1;
      headerCell.strokeAlign = "INSIDE";

      const headerText = figma.createText();
      headerText.characters = col;
      headerText.fontName = { family: "Inter", style: "Medium" };
      headerText.fontSize = fontSizeValue;
      headerText.fills = [{ type: "SOLID", color: headerTextRgb }];
      headerText.layoutAlign = "STRETCH"; // STRETCH untuk mengisi width cell
      headerText.constraints = { horizontal: "STRETCH", vertical: "MIN" };
      headerText.layoutPositioning = "AUTO";
      // Set text alignment
      headerText.textAlignHorizontal = textAlignMap[textAlignment] || "LEFT";

      // Tambahkan text ke cell SEBELUM menambahkan cell ke row
      headerCell.appendChild(headerText);
      headerRow.appendChild(headerCell);
    });

    component.appendChild(headerRow);

    // Buat data rows
    for (let i = 0; i < rowCount; i++) {
      const dataRow = figma.createFrame();
      dataRow.name = `Row ${i + 1}`;
      dataRow.layoutMode = "HORIZONTAL";
      dataRow.counterAxisSizingMode = "AUTO"; // AUTO untuk height
      dataRow.primaryAxisSizingMode = "FIXED"; // FIXED untuk width (sesuai dengan component)
      dataRow.primaryAxisAlignItems = "MIN"; // LEFT alignment seperti preview
      dataRow.counterAxisAlignItems = "CENTER";
      dataRow.itemSpacing = 0;
      dataRow.paddingLeft = 0;
      dataRow.paddingRight = 0;
      dataRow.paddingTop = 0;
      dataRow.paddingBottom = 0;
      dataRow.resize(totalWidth, estimatedRowHeight); // Set initial size

      // Striped rows
      const isStriped = stripedRows === "yes" && i % 2 === 1;
      dataRow.fills = [{ type: "SOLID", color: isStriped ? stripedRowBgRgb : rowBgRgb }];
      // Border di semua sisi seperti preview (border-collapse effect)
      dataRow.strokes = [{ type: "SOLID", color: borderRgb }];
      dataRow.strokeWeight = 1;
      dataRow.strokeAlign = "INSIDE";

      // Buat data cells
      columnList.forEach((_, colIdx) => {
        const dataCell = figma.createFrame();
        dataCell.name = `Cell ${i + 1}-${colIdx + 1}`;
        dataCell.layoutMode = "VERTICAL"; // VERTICAL untuk menampung text dengan benar
        dataCell.counterAxisSizingMode = "FIXED";
        dataCell.primaryAxisSizingMode = "FIXED";
        dataCell.resize(columnWidth, estimatedRowHeight); // Set size fixed
        // Set alignment berdasarkan textAlignment
        dataCell.primaryAxisAlignItems = alignmentMap[textAlignment] || "MIN";
        dataCell.counterAxisAlignItems = "CENTER";
        dataCell.itemSpacing = 0;
        dataCell.paddingLeft = paddingLeft;
        dataCell.paddingRight = paddingRight;
        dataCell.paddingTop = paddingTop;
        dataCell.paddingBottom = paddingBottom;
        dataCell.fills = [];
        // Border di semua sisi seperti preview (border-collapse effect)
        dataCell.strokes = [{ type: "SOLID", color: borderRgb }];
        dataCell.strokeWeight = 1;
        dataCell.strokeAlign = "INSIDE";

        const cellText = figma.createText();
        cellText.characters = "Data";
        cellText.fontName = { family: "Inter", style: "Regular" };
        cellText.fontSize = fontSizeValue;
        cellText.fills = [{ type: "SOLID", color: rowTextRgb }];
        cellText.layoutAlign = "STRETCH"; // STRETCH untuk mengisi width cell
        cellText.constraints = { horizontal: "STRETCH", vertical: "MIN" };
        cellText.layoutPositioning = "AUTO";
        // Set text alignment
        cellText.textAlignHorizontal = textAlignMap[textAlignment] || "LEFT";

        // Tambahkan text ke cell SEBELUM menambahkan cell ke row
        dataCell.appendChild(cellText);
        dataRow.appendChild(dataCell);
      });

      component.appendChild(dataRow);
    }

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");

    // Store styling data
    component.setPluginData("columns", columns);
    component.setPluginData("rows", rows);
    component.setPluginData("headerBgColor", headerBgColor);
    component.setPluginData("headerTextColor", headerTextColor);
    component.setPluginData("rowBgColor", rowBgColor);
    component.setPluginData("stripedRowBgColor", stripedRowBgColor);
    component.setPluginData("rowTextColor", rowTextColor);
    component.setPluginData("borderColor", borderColor);
    component.setPluginData("fontSize", fontSize);
    component.setPluginData("padding", padding);
    component.setPluginData("stripedRows", stripedRows);
    component.setPluginData("textAlignment", textAlignment);

    // Komponen sudah memiliki ukuran yang valid dari resize di atas

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Data Table berhasil dibuat (${columnList.length} kolom, ${rowCount} baris)!`);
  });

  on<CreateRadioButtonHandler>("CREATE_RADIO_BUTTON", async props => {
    const { headingLabel, headingFontSize, headingColor, radioLabels, radioCount, labelColor, labelFontSize, checkedColor, layoutDirection, hoverBorderColor, hoverBgColor, transitionType, htmltailwind } = props;

    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch (error) {
      figma.notify("Gagal memuat font 'Inter': " + error);
      return;
    }

    // Buat component
    const component = figma.createComponent();
    component.name = "Radio Button";
    component.layoutMode = layoutDirection === "horizontal" ? "HORIZONTAL" : "VERTICAL";
    component.counterAxisSizingMode = "AUTO";
    component.primaryAxisSizingMode = "AUTO";
    component.itemSpacing = layoutDirection === "horizontal" ? 12 : 12;
    component.paddingLeft = 0;
    component.paddingRight = 0;
    component.paddingTop = 0;
    component.paddingBottom = 0;
    component.fills = [];

    // Buat heading text di atas
    const headingText = figma.createText();
    headingText.characters = headingLabel;
    headingText.fontName = { family: "Inter", style: "Medium" };
    headingText.fontSize = Number(headingFontSize) || 18;
    headingText.fills = [{ type: "SOLID", color: hexToRgb(headingColor) }];
    headingText.name = "Heading";

    // Buat container untuk heading dan radio buttons
    const container = figma.createFrame();
    container.name = "Radio Button Container";
    container.layoutMode = "VERTICAL";
    container.counterAxisSizingMode = "AUTO";
    container.primaryAxisSizingMode = "AUTO";
    container.itemSpacing = 16;
    container.fills = [];

    container.appendChild(headingText);

    // Buat form frame untuk radio buttons
    const formFrame = figma.createFrame();
    formFrame.name = "Form";
    formFrame.layoutMode = layoutDirection === "horizontal" ? "HORIZONTAL" : "VERTICAL";
    formFrame.counterAxisSizingMode = "AUTO";
    formFrame.primaryAxisSizingMode = "AUTO";
    formFrame.itemSpacing = 12;
    formFrame.fills = [];

    // Parse labels
    const count = parseInt(radioCount) || 1;
    const labels = radioLabels
      .split(",")
      .map(l => l.trim())
      .slice(0, count);

    // Buat multiple radio buttons
    for (let i = 0; i < labels.length; i++) {
      // Buat frame untuk radio + label inline
      const radioRow = figma.createFrame();
      radioRow.name = `Radio ${i + 1}`;
      radioRow.layoutMode = "HORIZONTAL";
      radioRow.counterAxisSizingMode = "AUTO";
      radioRow.primaryAxisSizingMode = "AUTO";
      radioRow.itemSpacing = 8; // space-x-2 = 8px
      radioRow.fills = [];

      // Buat frame untuk radio button (untuk menampung outer dan inner circle)
      const radioFrame = figma.createFrame();
      radioFrame.name = "Radio Button";
      radioFrame.resize(16, 16);
      radioFrame.fills = [];
      radioFrame.clipsContent = true;

      // Buat radio button circle (default size: 16px = w-4 h-4)
      const radioCircle = figma.createEllipse();
      radioCircle.name = "Radio Circle";
      radioCircle.resize(16, 16);
      radioCircle.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; // white background
      radioCircle.strokes = [{ type: "SOLID", color: { r: 0.82, g: 0.82, b: 0.82 } }]; // border-gray-300
      radioCircle.strokeWeight = 1;
      radioFrame.appendChild(radioCircle);

      // Buat inner circle untuk checked state (jika i === 0, set as checked)
      if (i === 0) {
        const innerCircle = figma.createEllipse();
        innerCircle.name = "Inner Circle";
        innerCircle.resize(8, 8);
        innerCircle.fills = [{ type: "SOLID", color: hexToRgb(checkedColor) }];
        innerCircle.x = 4;
        innerCircle.y = 4;
        radioFrame.appendChild(innerCircle);
      }

      // Buat label text
      const labelText = figma.createText();
      labelText.characters = labels[i];
      labelText.fontName = { family: "Inter", style: "Regular" };
      labelText.fontSize = Number(labelFontSize) || 14;
      labelText.fills = [{ type: "SOLID", color: hexToRgb(labelColor) }];
      labelText.name = "Label";

      // Susun radio row
      radioRow.appendChild(radioFrame);
      radioRow.appendChild(labelText);

      // Tambahkan radio row ke form frame
      formFrame.appendChild(radioRow);
    }

    container.appendChild(formFrame);
    component.appendChild(container);

    // Simpan data plugin
    const componentId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
    component.setPluginData("id", componentId);
    component.setPluginData("htmltailwind", htmltailwind || "");
    component.setPluginData("radioButtonProps", JSON.stringify(props));

    // Store styling data
    component.setPluginData("headingLabel", headingLabel);
    component.setPluginData("headingFontSize", headingFontSize);
    component.setPluginData("headingColor", headingColor);
    component.setPluginData("radioLabels", radioLabels);
    component.setPluginData("radioCount", radioCount);
    component.setPluginData("labelColor", labelColor);
    component.setPluginData("labelFontSize", labelFontSize);
    component.setPluginData("checkedColor", checkedColor);
    component.setPluginData("layoutDirection", layoutDirection);
    component.setPluginData("hoverBorderColor", hoverBorderColor);
    component.setPluginData("hoverBgColor", hoverBgColor);
    component.setPluginData("transitionType", transitionType);

    // Tambahkan ke canvas dan seleksi
    figma.currentPage.appendChild(component);
    figma.viewport.scrollAndZoomIntoView([component]);
    figma.currentPage.selection = [component];

    figma.notify(`✅ Radio Button berhasil dibuat (${labels.length} radio)!`);
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

  showUI({ width: 1200, height: 700 });
}
