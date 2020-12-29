import React from "react"
import styled from "styled-components"

export const StyledButton = styled.button`
  padding: 3px 8px 4px;
  border: 0;

  background: var(--bg);
  color: var(--fg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-raised);

  appearance: none;
  cursor: pointer;

  &:hover,
  &:focus {
    background: var(--fg-6);
  }
`

class Button extends React.Component {
  render() {
    return (
      <StyledButton {...this.props} type="button">
        <span className="h3">{this.props.children}</span>
      </StyledButton>
    )
  }
}

export default Button
