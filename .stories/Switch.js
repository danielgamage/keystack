import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import {
  Switch,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: false
    }
  }

  updateValue (v) {
    // console.log('before', v, this.state.value)
    this.setState({value: v})
    // console.log('after', v, this.state.value)
  }

  render () {
    console.log('render echo.js')
    return (
      <div>
        <Switch
          value={this.state.value}
          onInput={this.updateValue.bind(this)}
        />
      </div>
    )
  }
}

storiesOf('Switch', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
