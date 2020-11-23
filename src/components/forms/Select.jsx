import React from 'react'
import styled from 'styled-components'

import vars from 'variables'

import {
  Text,
} from 'components'

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
    border-top: .3rem solid ${vars.grey_6};
    border-right: .25rem solid transparent;
    border-bottom: .3rem solid transparent;
    border-left: .25rem solid transparent;
  }

  select {
    all: inherit;
    padding: 4px 24px 3px 8px;
    border: 0;

    appearance: none;
    cursor: pointer;

    background: ${vars.grey_1};
    color: ${vars.grey_6};
    border-radius: ${vars.radius};

    &:hover,
    &:focus {
      background: ${vars.grey_2};
    }
  }
`

class Button extends React.Component {
  render () {
    return (
      <StyledSelect {...this.props} type='button'>
        <Text type='h3'>
          <select
            onChange={(e) => {
              this.props.onUpdate(e.target.value)
            }}
          >
            {this.props.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Text>
      </StyledSelect>
    )
  }
}

export default Button
