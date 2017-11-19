import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs'

import {
  ThemeSettings,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.updateValue = this.updateValue.bind(this)

    this.state = {
      prefs: {
        lightness: 'dark',
        accent: 'orange',
      }
    }
  }

  updateValue (v) {
    this.setState({prefs: v})
  }

  render () {
    return (
      <ThemeSettings
        prefs={this.state.prefs}
        onInput={this.updateValue.bind(this)}
      />
    )
  }
}

storiesOf('ThemeSettings', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
