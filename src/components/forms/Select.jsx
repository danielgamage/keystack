import React from "react"
import styled from "styled-components"

import vars from "variables"

import { Text } from "components"

export const StyledSelect = styled.div`
  display: inline-block;
  position: relative;

  &::after {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    display: inline-block;
    content: "";
    width: 0;
    height: 0;
    margin-top: -0.15rem;
    pointer-events: none;
    border-top: 0.3rem solid var(--fg);
    border-right: 0.25rem solid transparent;
    border-bottom: 0.3rem solid transparent;
    border-left: 0.25rem solid transparent;
  }

  select {
    all: inherit;
    padding: 3px 24px 4px 8px;
    border: 0;

    color: var(--fg-1);
    border-radius: var(--radius);
    box-shadow: var(--shadow-raised);

    appearance: none;
    cursor: pointer;

    &:hover,
    &:focus {
      background: var(--fg-6);
    }
  }
`

class Select extends React.Component {
  render() {
    return (
      <StyledSelect {...this.props} className="button h3">
        <select
          onChange={(e) => {
            this.props.onUpdate(e.target.value)
          }}
        >
          {this.props.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              selected={option.value === this.props.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </StyledSelect>
    )
  }
}

export default Select
