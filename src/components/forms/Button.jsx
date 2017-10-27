import React from 'react'
import styled from 'styled-components'

import vars from '@/variables'

export const StyledButton = styled.button`
  padding: 0.2rem 0.4rem 0.25rem;
  border: 0;

  ${vars.sc_mixin}

  background: ${vars.grey_1};
  color: ${vars.grey_6};
  border-radius: ${vars.radius};

  appearance: none;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${vars.grey_2};
  }
`

class Button extends React.Component {
  render () {
    return (
      <StyledButton {...this.props} type='button'>
        {this.props.children}
      </StyledButton>
    )
  }
}

export default Button
