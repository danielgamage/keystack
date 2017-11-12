import React from 'react'
import styled from 'styled-components'

import {
  HiddenInput,
} from '@/components'

import vars from '@/variables'

export const Container = styled.label`
  position: relative;

  .background {
    height: 16px;
    width: 32px;
    display: flex;
    padding: 0 8px;
    background: ${props => props.value
      ? vars.grey_2
      : vars.grey_6
    };
    border-radius: 16px;
    transition: background 0.2s ease;

    &-container {
      position: relative;
      width: 100%;
    }
  }

  .foreground {
    position: absolute;
    top: 3px;
    left: ${props => props.value
      ? '100%'
      : '0%'
    };
    height: 10px;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      left 0.2s ease,
      background 0.1s ease;

    &-circle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${props => props.value
        ? vars.grey_7
        : vars.grey_2
      };
      border-radius: 5px;
    }
  }
`

class Button extends React.Component {
  render () {
    console.log(this.props.value)
    return (
      <Container
        {...this.props}
      >
        <HiddenInput
          type='checkbox'
          onClick={() => this.props.onInput(!this.props.value)}
        />

        <div className='background'>
          <div className='background-container'>
            <div className='foreground'>
              <div className='foreground-circle' />
            </div>
          </div>
        </div>

      </Container>
    )
  }
}

export default Button
