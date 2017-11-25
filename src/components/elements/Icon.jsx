import React, { Component } from 'react'
import 'whatwg-fetch'

import styled from 'styled-components'
import vars from '@/variables.js'

export const StyledIcon = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  fill: none;
  stroke: ${vars.grey_1};
  stroke-width: 2px;
  stroke-linecap: round;
  transition: 0.2s ease;
`

class Icon extends Component {
  constructor (props) {
    super(props)
    this.state = {
      image: `<svg viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="10"></circle>
      </svg>`
    }
  }
  componentWillMount () {
    fetch(this.props.src).then(data => {
      return data.text()
    }).then(data => {
      this.setState({
        image: data
      })
    })
  }
  render () {
    return (
      <StyledIcon
        {...this.props}
        dangerouslySetInnerHTML={{__html: this.state.image}}
      />
    )
  }
}

export default Icon
