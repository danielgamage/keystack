import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, color, number } from "@storybook/addon-knobs";

import { Text } from "@/components";

storiesOf("Text", module).add("all", () => {
  const testText = text("text", "Text of all sizes");
  const tests = ["h1", "h2", "h3", "value", "flourish"];
  return (
    <div>
      {tests.map(test => [
        <Text style={{ color: "#ccc" }} type="h3">
          {test} text
        </Text>,
        <Text type={test}>{testText}</Text>,
        <hr />
      ])}
    </div>
  );
});
