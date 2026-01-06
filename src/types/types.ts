import { EventHandler } from "@create-figma-plugin/utilities";

export interface CreateButtonHandler extends EventHandler {
  name: "CREATE_BUTTON";
  handler: (
    color: string,
    label: string,
    borderRadius: number,
    fontSize: number,
    fontWeight: string,
    padding: string,
    labelColor: string,
    htmltailwind: string,
    borderWidth?: number,
    borderColor?: string,
    // Dynamic styling parameters
    hoverTextColor?: string,
    hoverBgColor?: string,
    hoverBorderColor?: string,
    focusBorderColor?: string,
    focusRingSize?: string,
    activeScale?: string,
    activeBgColor?: string,
    activeShadowSize?: string,
    transitionDuration?: string,
    transitionEasing?: string,
    transitionDelay?: string,
    transitionType?: string,
    hoverScaleType?: string,
    hoverOpacity?: string,
    hoverScale?: string,
    hoverScaleDuration?: string,
    hoverTranslateX?: string,
    hoverRotate?: string
  ) => void;
}

export interface CreateAlertBannerHandler extends EventHandler {
  name: "CREATE_ALERT_BANNER";
  handler: (props: {
    alertType: string;
    title: string;
    message: string;
    borderRadius: string;
    width?: string;
    height?: string;
    padding?: string;
    iconSize?: string;
    titleFontSize?: string;
    titleColor?: string;
    messageFontSize?: string;
    messageColor?: string;
    borderWidth?: string;
    borderColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
    hoverBorderColor?: string;
    focusRingWidth?: string;
    focusRingColor?: string;
    transitionType?: string;
    htmltailwind: string;
  }) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}

export interface SelectionChangeHandler extends EventHandler {
  name: "SELECTION_CHANGE";
  handler: (htmltailwind: string) => void;
}

export interface CreateTabsHandler extends EventHandler {
  name: "CREATE_TABS";
  handler: (props: {
    tabCount: string;
    tabLabels: string;
    fontSize: string;
    activeTextColor: string;
    activeBorderColor: string;
    inactiveTextColor: string;
    hoverTextColor: string;
    hoverBorderColor: string;
    tabGap: string;
    textBorderGap: string;
    htmltailwind: string;
  }) => void;
}

export interface CreateSwitchHandler extends EventHandler {
  name: "CREATE_SWITCH";
  handler: (props: {
    switchWidth: string;
    switchHeight: string;
    trackBorderRadius: string;
    uncheckedBgColor: string;
    checkedBgColor: string;
    thumbSize: string;
    thumbBgColor: string;
    transitionDuration: string;
    transitionEasing: string;
    defaultChecked: string;
    htmltailwind: string;
  }) => void;
}

export interface CreateProgressIndicatorHandler extends EventHandler {
  name: "CREATE_PROGRESS_INDICATOR";
  handler: (props: {
    progressValue: string;
    progressType: string;
    width: string;
    height: string;
    progressColor: string;
    bgColor: string;
    borderRadius: string;
    percentageTextColor: string;
    percentageMargin: string;
    showPercentage: string;
    htmltailwind: string;
  }) => void;
}

export interface CreateDataTableHandler extends EventHandler {
  name: "CREATE_DATA_TABLE";
  handler: (props: {
    columns: string;
    rows: string;
    headerBgColor: string;
    headerTextColor: string;
    rowBgColor: string;
    stripedRowBgColor: string;
    rowTextColor: string;
    borderColor: string;
    fontSize: string;
    padding: string;
    stripedRows: string;
    textAlignment: string;
    htmltailwind: string;
  }) => void;
}

export interface CreateTooltipHandler extends EventHandler {
  name: "CREATE_TOOLTIP";
  handler: (props: { tooltipText: string; bgColor: string; textColor: string; fontSize: string; padding: string; borderRadius: string; marginBottom: string; htmltailwind: string }) => void;
}

export interface CreateRadioButtonHandler extends EventHandler {
  name: "CREATE_RADIO_BUTTON";
  handler: (props: {
    headingLabel: string;
    headingFontSize: string;
    headingFontWeight: string;
    headingColor: string;
    radioLabels: string;
    radioCount: string;
    labelColor: string;
    labelFontSize: string;
    labelFontWeight: string;
    labelFontWeightChecked: string;
    labelColorChecked: string;
    checkedColor: string;
    gapBetweenItems: string;
    gapBetweenRadioAndLabel: string;
    radioSize: string;
    borderWidth: string;
    defaultBorderColor: string;
    hoverBorderColor: string;
    innerDotSize: string;
    transitionDuration: string;
    htmltailwind: string;
  }) => void;
}
