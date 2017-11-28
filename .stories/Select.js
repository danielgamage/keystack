import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import {
  Select,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 'one',
    }
  }

  updateValue (v) {
    this.setState({value: v})
  }

  render () {
    return (
      <div>
        <Select
          options={[{
            value: 'one',
            label: 'One',
          }, {
            value: 'two',
            label: 'Two',
          }]}
          value={this.state.value}
          onUpdate={this.updateValue.bind(this)}
        />

        <div>{this.state.value}</div>
      </div>
    )
  }
}

storiesOf('Select', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
