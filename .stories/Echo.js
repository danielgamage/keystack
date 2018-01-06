import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { text, boolean, color, number } from "@storybook/addon-knobs";

import { Echo } from "@/components";

class Wrapper extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   feedback: 0.8,
    //   delayTime: 0.5,
    // }
  }

  updateValue(v) {
    // console.log('before', v, this.state.value)
    this.setState({ value: v });
    // console.log('after', v, this.state.value)
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log('willreceiveprops')
  //   const propKeys = ['feedback', 'delayTime']
  //
  //   propKeys.forEach(key => {
  //     if (nextProps[key] !== this.props[key]) {
  //       console.log('not same', nextProps[key], this.props[key])
  //       this.setState({
  //         [key]: nextProps[key]
  //       })
  //     }
  //   })
  //
  // }

  render() {
    return (
      <div>
        <Echo
          feedback={this.props.feedback}
          delayTime={this.props.delayTime}
          mix={this.props.mix}
          onInput={this.updateValue.bind(this)}
        />
        <br />
        <div>feedback: {this.props.feedback}</div>
        <div>delayTime: {this.props.delayTime}</div>
        <div>mix: {this.props.mix}</div>
      </div>
    );
  }
}

storiesOf("Echo", module).add("basic", () => {
  return (
    <Wrapper
      feedback={number("feedback", 0.5, {
        range: true,
        min: 0,
        max: 0.98,
        step: 0.01
      })}
      delayTime={number("delayTime", 0.5, {
        range: true,
        min: 0.01,
        max: 10,
        step: 0.1
      })}
      mix={number("mix", 0.5, {
        range: true,
        min: 0,
        max: 1,
        step: 0.01
      })}
    />
  );
});
