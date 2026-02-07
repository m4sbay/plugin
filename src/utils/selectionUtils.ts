/**
 * Mengambil data komponen terpilih dari Figma canvas.
 * Digunakan oleh handler SELECTION_CHANGE dan figma.on("selectionchange").
 */
export function getSelectionData(): string {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    return "";
  }

  const selectedNode = selection[0];
  const htmltailwind = selectedNode.getPluginData("htmltailwind");
  const nodeName = selectedNode.name;

  if (!htmltailwind) {
    return "";
  }

  const g = (key: string, fallback = "") => selectedNode.getPluginData(key) || fallback;

  switch (nodeName) {
    case "Button": {
      const data = {
        componentType: "button",
        htmltailwind,
        color: g("color"),
        label: g("label"),
        borderRadius: g("borderRadius"),
        fontSize: g("fontSize"),
        fontWeight: g("fontWeight"),
        padding: g("padding"),
        labelColor: g("labelColor"),
        borderWidth: g("borderWidth"),
        borderColor: g("borderColor"),
        hoverTextColor: g("hoverTextColor"),
        hoverBgColor: g("hoverBgColor"),
        hoverBorderColor: g("hoverBorderColor"),
        focusBorderColor: g("focusBorderColor"),
        focusRingSize: g("focusRingSize"),
        activeBgColor: g("activeBgColor"),
        activeShadowSize: g("activeShadowSize"),
        transitionType: g("transitionType"),
        transitionEasing: g("transitionEasing"),
        transitionDelay: g("transitionDelay"),
        hoverScaleType: g("hoverScaleType"),
        hoverOpacity: g("hoverOpacity") || undefined,
        hoverScale: g("hoverScale") || undefined,
        hoverScaleDuration: g("hoverScaleDuration") || undefined,
        hoverTranslateX: g("hoverTranslateX") || undefined,
        hoverRotate: g("hoverRotate") || undefined,
      };
      return JSON.stringify(data);
    }

    case "Checkbox": {
      const data = {
        componentType: "checkbox",
        htmltailwind,
        checkboxLabel: g("checkboxLabel"),
        checkboxDescription: g("checkboxDescription"),
        labelColor: g("labelColor"),
        labelFontSize: g("labelFontSize"),
        labelFontWeight: g("labelFontWeight"),
        descriptionColor: g("descriptionColor"),
        descriptionFontSize: g("descriptionFontSize"),
        checkboxSize: g("checkboxSize"),
        borderRadius: g("borderRadius"),
        defaultChecked: g("defaultChecked", "off"),
        checkedBgColor: g("checkedBgColor"),
        gapBetweenCheckboxLabel: g("gapBetweenCheckboxLabel"),
        checkmarkSize: g("checkmarkSize"),
        checkmarkColor: g("checkmarkColor"),
      };
      return JSON.stringify(data);
    }

    case "Text Field": {
      const data = {
        componentType: "text-field",
        htmltailwind,
        label: g("label"),
        labelColor: g("labelColor"),
        labelFontSize: g("labelFontSize") || g("fontSize"),
        placeholder: g("placeholder"),
        width: g("width"),
        bgColor: g("bgColor"),
        borderRadius: g("borderRadius"),
        borderColor: g("borderColor"),
        paddingX: g("paddingX"),
        paddingY: g("paddingY"),
        gap: g("gap"),
        inputTextColor: g("inputTextColor"),
        focusRingColor: g("focusRingColor") || g("ringColor"),
      };
      return JSON.stringify(data);
    }

    case "Radio Button": {
      const data = {
        componentType: "radio-button",
        htmltailwind,
        radioLabels: g("radioLabels"),
        radioCount: g("radioCount"),
        labelColor: g("labelColor"),
        labelFontSize: g("labelFontSize"),
        labelColorChecked: g("labelColorChecked"),
        checkedColor: g("checkedColor"),
        radioSize: g("radioSize"),
        defaultBorderColor: g("defaultBorderColor"),
        hoverBorderColor: g("hoverBorderColor"),
        layoutDirection: g("layoutDirection"),
        hoverBgColor: g("hoverBgColor"),
        transitionType: g("transitionType"),
      };
      return JSON.stringify(data);
    }

    case "Progress Indicator": {
      const data = {
        componentType: "progress-indicator",
        htmltailwind,
        progressValue: g("progressValue"),
        progressType: g("progressType"),
        width: g("width"),
        height: g("height"),
        progressColor: g("progressColor"),
        bgColor: g("bgColor"),
        borderRadius: g("borderRadius"),
        percentageTextColor: g("percentageTextColor"),
        percentageMargin: g("percentageMargin"),
        showPercentage: g("showPercentage"),
      };
      return JSON.stringify(data);
    }

    case "Data Table": {
      const data = {
        componentType: "data-table",
        htmltailwind,
        columns: g("columns"),
        rows: g("rows"),
        headerBgColor: g("headerBgColor"),
        headerTextColor: g("headerTextColor"),
        rowBgColor: g("rowBgColor"),
        stripedRowBgColor: g("stripedRowBgColor"),
        rowTextColor: g("rowTextColor"),
        borderColor: g("borderColor"),
        fontSize: g("fontSize"),
        padding: g("padding"),
        stripedRows: g("stripedRows"),
        textAlignment: g("textAlignment"),
      };
      return JSON.stringify(data);
    }

    case "Tooltip": {
      const data = {
        componentType: "tooltip",
        htmltailwind,
        tooltipText: g("tooltipText"),
        bgColor: g("bgColor"),
        textColor: g("textColor"),
        fontSize: g("fontSize"),
        padding: g("padding"),
        borderRadius: g("borderRadius"),
        marginBottom: g("marginBottom"),
      };
      return JSON.stringify(data);
    }

    case "Alert Banner": {
      const data = {
        componentType: "alert-banner",
        htmltailwind,
        alertType: g("alertType"),
        title: g("title"),
        message: g("message"),
        borderRadius: g("borderRadius"),
        width: g("width"),
        height: g("height"),
        padding: g("padding"),
        iconSize: g("iconSize"),
        titleFontSize: g("titleFontSize"),
        titleColor: g("titleColor"),
        messageFontSize: g("messageFontSize"),
        messageColor: g("messageColor"),
        borderWidth: g("borderWidth"),
        borderColor: g("borderColor"),
        bgColor: g("bgColor"),
        hoverBgColor: g("hoverBgColor"),
        hoverBorderColor: g("hoverBorderColor"),
        focusRingWidth: g("focusRingWidth"),
        focusRingColor: g("focusRingColor"),
        transitionType: g("transitionType"),
      };
      return JSON.stringify(data);
    }

    case "Switch": {
      const data = {
        componentType: "switch",
        htmltailwind,
        switchCount: g("switchCount"),
        switchLabels: g("switchLabels"),
        containerWidth: g("containerWidth"),
        headlineText: g("headlineText"),
        headlineColor: g("headlineColor"),
        headlineFontSize: g("headlineFontSize"),
        labelColor: g("labelColor"),
        labelFontSize: g("labelFontSize"),
        uncheckedBorderColor: g("uncheckedBorderColor"),
        uncheckedBgColor: g("uncheckedBgColor"),
        checkedBorderColor: g("checkedBorderColor"),
        checkedBgColor: g("checkedBgColor"),
        thumbBgColor: g("thumbBgColor"),
        toggleBgColor: g("toggleBgColor"),
        defaultChecked: g("defaultChecked"),
        defaultCheckedStates: g("defaultCheckedStates"),
        disabledStates: g("disabledStates"),
        transitionDuration: g("transitionDuration"),
        transitionEasing: g("transitionEasing"),
        transitionType: g("transitionType"),
      };
      return JSON.stringify(data);
    }

    case "Tabs": {
      const data = {
        componentType: "tabs",
        htmltailwind,
        tabCount: g("tabCount"),
        tabLabels: g("tabLabels"),
        fontSize: g("fontSize"),
        containerBgColor: g("containerBgColor"),
        activeBgColor: g("activeBgColor"),
        activeTextColor: g("activeTextColor"),
        inactiveTextColor: g("inactiveTextColor"),
        tabBorderRadius: g("tabBorderRadius"),
        tabGap: g("tabGap"),
        textBorderGap: g("textBorderGap"),
        containerPadding: g("containerPadding"),
        panelContents: g("panelContents"),
        transitionType: g("transitionType"),
        tabsWidth: g("tabsWidth"),
      };
      return JSON.stringify(data);
    }

    default:
      return htmltailwind;
  }
}
