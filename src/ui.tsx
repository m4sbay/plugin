import { render } from "@create-figma-plugin/ui";
import { h } from "preact";
import { useState } from "preact/hooks";
import { Dashboard } from "./components/Dashboard";
import { ComponentList } from "./components/ComponentList";
import { ButtonCreator } from "./components/ButtonCreator";
import { CheckboxCreator } from "./components/CheckboxCreator";
import { TextFieldCreator } from "./components/TextFieldCreator";
import { RadioButton } from "./components/RadioButton";
import { TabsCreator } from "./components/TabsCreator";
import { SwitchCreator } from "./components/SwitchCreator";
import { AlertBannerCreator } from "./components/AlertBannerCreator";
import { TooltipCreator } from "./components/TooltipCreator";
import { ProgressIndicatorCreator } from "./components/ProgressIndicatorCreator";
import { DataTableCreator } from "./components/DataTableCreator";


function Plugin() {
  const [page, setPage] = useState <"dashboard" | "component-list" | "button-creator" | "checkbox-creator" | "text-field-creator" | "radio-button" | "tabs-creator" | "switch-creator" | "alert-banner-creator" | "tooltip-creator" | "progress-indicator-creator" | "data-table-creator">("dashboard");

  if (page === "dashboard") {
    return <Dashboard onStart={() => setPage("component-list")} />;
  }
  if (page === "component-list") {
    return (
      <ComponentList
        onSelectComponent={name => {
          if (name === "Button") setPage("button-creator");
          if (name === "Checkbox") setPage("checkbox-creator");
          if (name === "Text Field") setPage("text-field-creator");
          if (name === "Radio Button") setPage("radio-button");
          if (name === "Tabs") setPage("tabs-creator");
          if (name === "Switch") setPage("switch-creator");
          if (name === "Alert Banner") setPage("alert-banner-creator");
          if (name === "Tooltip") setPage("tooltip-creator");
          if (name === "Progress Indicator") setPage("progress-indicator-creator");
          if (name === "Data Table") setPage("data-table-creator");
        }}
        onBack={() => setPage("dashboard")}
      />
    );
  }
  if (page === "button-creator") {
    return <ButtonCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "checkbox-creator") {
    return <CheckboxCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "text-field-creator") {
    return <TextFieldCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "radio-button") {
    return <RadioButton onBack={() => setPage("component-list")} />;
  }
  if (page === "tabs-creator") {
    return <TabsCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "switch-creator") {
    return <SwitchCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "alert-banner-creator") {
    return <AlertBannerCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "tooltip-creator") {
    return <TooltipCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "progress-indicator-creator") {
    return <ProgressIndicatorCreator onBack={() => setPage("component-list")} />;
  }
  if (page === "data-table-creator") {
    return <DataTableCreator onBack={() => setPage("component-list")} />;
  }

  return null;
}

export default render(Plugin);
