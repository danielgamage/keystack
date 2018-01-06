import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, color, number } from "@storybook/addon-knobs";

import { NumericInput } from "@/components";

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 40
    };
  }
  update(v) {
    console.log("before", v, this.state.value);
    this.setState({ value: v });
    console.log("after", v, this.state.value);
  }
  render() {
    const min = number("Min", 30);
    const max = number("Max", 1000);
    let value = 80;

    return (
      <div>
        <NumericInput
          label="tune"
          small={boolean("Small", false)}
          min={min}
          max={max}
          step={1}
          scale={1}
          unit=" ct"
          displayValue={this.state.value}
          value={this.state.value}
          action={{
            type: "UPDATE_OSC",
            property: "detune"
          }}
          onInput={this.update.bind(this)}
        />
      </div>
    );
  }
}

storiesOf("NumericInput", module).add("solo", () => {
  return <Wrapper />;
});
