import React from 'react'
import styled from 'styled-components'

import vars from '../../variables.js'

export const StyledKbd = styled.kbd`
  display: inline-block;
  width: 1.4rem;
  height: 1.4rem;
  margin: 0.1rem;
  padding: 0.2rem;
  border: 1px solid;

  background: ${vars.grey_0};
  color: ${vars.grey_5};
  border-radius: ${vars.radius};

  font-family: ${vars.sc};
  text-transform: uppercase;
  font-size: 0.6rem;
  line-height: 1rem;
  text-align: center;
`

class Button extends React.Component {
  render () {
    return (
      <StyledKbd {...this.props}>
        {this.props.children}
      </StyledKbd>
    )
  }
}

export default Button
