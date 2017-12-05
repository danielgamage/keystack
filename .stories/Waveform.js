import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import {
  PeriodicWaveInput,
  Waveform,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: Array(64).fill(1)
    }
  }
  updateValue (v) {
    // console.log('before', v, this.state.value)
    this.setState({value: v})
    // console.log('after', v, this.state.value)
  }
  render () {
    return (
      <div>
        <PeriodicWaveInput
          value={this.state.value}
          resolution={64}
          onInput={this.updateValue.bind(this)}
        />
        <Waveform
          value={this.state.value}
        />
      </div>
    )
  }
}

storiesOf('PeriodicWaveInput', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
