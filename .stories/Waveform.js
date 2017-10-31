import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import {
  Waveform,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: [
        1,
        0.5,
        0.2,
        0.15,
        0.11,
        0.09,
        0.08,
      ]
    }
  }
  updateValue (v) {
    // console.log('before', v, this.state.value)
    this.setState({value: v})
    // console.log('after', v, this.state.value)
  }
  render () {
    return (
      <Waveform
        value={this.state.value}
        onInput={this.updateValue.bind(this)}
      />
    )
  }
}

storiesOf('Waveform', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
