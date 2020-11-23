import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Sample,
  Envelope,
  Item,
} from 'components'

class Sampler extends Component {
  render () {
    return (
      <Item type='instrument' index={this.props.index} item={this.props.data}>
        <Sample instrument={this.props.data} />
        <Envelope instrument={this.props.data} envelope={this.props.data.envelope} />
      </Item>
    )
  }
}

export default connect()(Sampler)
