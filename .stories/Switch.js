import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, color, number } from "@storybook/addon-knobs";

import { Switch, SwitchWithOptions } from "@/components";

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false
    };
  }

  updateValue(v) {
    // console.log('before', v, this.state.value)
    this.setState({ value: v });
    // console.log('after', v, this.state.value)
  }

  render() {
    return (
      <div>
        <Switch
          value={this.state.value}
          onInput={this.updateValue.bind(this)}
        />
      </div>
    );
  }
}

class WrapperWithOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Simple",
      options: [
        {
          value: "Simple",
          strong: false
        },
        {
          value: "Complex",
          strong: false
        }
      ]
    };
  }

  updateValue(v) {
    // console.log('before', v, this.state.value)
    this.setState({ value: v });
    // console.log('after', v, this.state.value)
  }

  render() {
    return (
      <div>
        <SwitchWithOptions
          value={this.state.value}
          options={this.state.options}
          orientation={boolean("row", true) ? "row" : "column"}
          onInput={this.updateValue.bind(this)}
        />
      </div>
    );
  }
}

class WrapperWithFourOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Sin",
      options: [
        {
          value: "Saw",
          strong: false
        },
        {
          value: "Tri",
          strong: false
        },
        {
          value: "Squ",
          strong: false
        },
        {
          value: "Sin",
          strong: false
        }
      ]
    };
  }

  updateValue(v) {
    // console.log('before', v, this.state.value)
    this.setState({ value: v });
    // console.log('after', v, this.state.value)
  }

  render() {
    return (
      <div>
        <SwitchWithOptions
          value={this.state.value}
          options={this.state.options}
          onInput={this.updateValue.bind(this)}
        />
        {this.state.value}
      </div>
    );
  }
}

storiesOf("Switch", module)
  .add("basic", () => {
    return <Wrapper />;
  })
  .add("with options", () => {
    return <WrapperWithOptions />;
  })
  .add("more than two options", () => {
    return <WrapperWithFourOptions />;
  });
