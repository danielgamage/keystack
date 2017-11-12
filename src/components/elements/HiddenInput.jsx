import React, { Component } from 'react'
import 'whatwg-fetch'
import styled from 'styled-components'


export const Input = styled.input`
  position: absolute;
  opacity: 0;
  z-index: -1;
  pointer-events: none;
`

class Icon extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Input
        {...this.props}
      />
    )
  }
}

export default Icon
