import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, color, number } from "@storybook/addon-knobs";

import { Button, Kbd } from "@/components";

storiesOf("Button", module).add("basic", () => {
  return (
    <Button onClick={action("clicked")}>{text("Button text", "Input")}</Button>
  );
});

storiesOf("Kbd", module).add("basic", () => {
  return <Kbd>{text("Key text", "A")}</Kbd>;
});
