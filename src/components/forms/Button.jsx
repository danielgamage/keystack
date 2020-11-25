import React from "react"
import styled from "styled-components"

import vars from "variables"

import { Text } from "components"

export const StyledButton = styled.button`
  padding: 4px 8px 3px;
  border: 0;

  background: var(--grey-1);
  color: var(--grey-6);
  border-radius: ${vars.radius};

  appearance: none;
  cursor: pointer;

  &:hover,
  &:focus {
    background: var(--grey-2);
  }
`

class Button extends React.Component {
  render() {
    return (
      <StyledButton {...this.props} type="button">
        <Text type="h3">{this.props.children}</Text>
      </StyledButton>
    )
  }
}

export default Button
