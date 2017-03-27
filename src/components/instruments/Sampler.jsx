import React, { Component } from 'react'
import { connect } from 'react-redux'

import Sample from '../Sample.jsx'
import Envelope from '../Envelope.jsx'
import Item from '../Item.jsx'

class Sampler extends Component {
  render () {
    return (
      <Item type='instrument' item={this.props.data}>
        <Sample instrument={this.props.data} />
        <Envelope instrument={this.props.data} envelope={this.props.data.envelope} />
      </Item>
    )
  }
}

export default connect()(Sampler)
