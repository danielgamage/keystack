import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  HiddenInput,
} from 'components'

import vars from 'variables'

export const Container = styled.label`
  position: relative;

  height: 16px;
  width: 32px;
  display: flex;
  padding: 0 8px;
  background: ${props => props.valueObject.strong
    ? vars.grey_2
    : vars.grey_6
  };
  border-radius: 16px;
  transition: background 0.2s ease-out;

  .container {
    position: relative;
    width: 100%;
  }

  .foreground {
    position: absolute;
    top: 3px;
    left: ${props => props.position}%;
    height: 10px;
    width: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      left 0.1s ease-out,
      background 0.1s ease-out;

    &-circle {
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${props => props.valueObject.strong
        ? vars.white
        : vars.grey_2
      };
      border-radius: 5px;
      cursor: pointer;

      &.is-active,
      &:hover {
        background: ${props => props.valueObject.strong
          ? vars.grey_6
          : vars.grey_3
        };
      }
    }
  }
`

class Switch extends React.Component {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.initialX = null
    this.hasMoved = false

    this.state = {
      isActive: false,
      value: 'Simple',
      options: [{
        value: 'Simple',
        strong: false,
      }, {
        value: 'Complex',
        strong: false,
      }],
      position: null,
    }
  }

  onMouseDown (e) {
    e.preventDefault()

    this.setState({isActive: true})

    this.containerBox = this.containerElement.getBoundingClientRect()
    this.initialX = e.pageX || e.touches[0].pageX

    window.addEventListener('mousemove', this.onDrag)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('touchmove', this.onDrag)
    window.addEventListener('touchend', this.onMouseUp)
    window.addEventListener('mouseleave', this.onMouseUp)
    window.addEventListener('blur', this.onMouseUp)

    this.onDrag(e)
  }

  onDrag (e) {
    const viewportPosition = e.pageX || e.touches[0].pageX
    const position = viewportPosition - this.containerBox.left

    if (!this.hasMoved && viewportPosition !== this.initialX) {
      this.hasMoved = true
    }

    let optionSpacing = this.containerBox.width / (this.props.options.length - 1)

    const newIndex = Array(this.props.options.length).fill().findIndex((el, i, arr) => {
      const positionMatchesOption = position < (i * optionSpacing) + (optionSpacing / 2)
      const isLastOption = i === arr.length - 1

      return positionMatchesOption || isLastOption
    })

    const newValue = this.props.options[newIndex].value

    if (newValue !== this.props.value) {
      this.props.onInput(newValue)
    }
  }

  onMouseUp (e) {
    this.position = null
    this.hasMoved = false

    window.removeEventListener('mousemove', this.onDrag)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('touchmove', this.onDrag)
    window.removeEventListener('touchend', this.onMouseUp)
    window.removeEventListener('mouseleave', this.onMouseUp)
    window.removeEventListener('blur', this.onMouseUp)

    this.setState({isActive: false})
  }

  render () {
    const valueIndex = this.props.options.findIndex(option => option.value === this.props.value)
    const valueObject = this.props.options[valueIndex]
    const position = this.state.position ||
      valueIndex / (this.props.options.length - 1) * 100

    return (
      <Container
        valueObject={valueObject}
        position={position}
        onMouseDown={this.onMouseDown}
        {...this.props}
      >
        {/* <HiddenInput
          type='checkbox'
          onClick={() => this.props.onInput(
            this.props.options[(valueIndex + 1) % this.props.options.length].value
          )}
        /> */}

        <div
          className='container'
          ref={(c) => this.containerElement = c}
        >
          <div className='foreground'>
            <div className={'foreground-circle ' + (this.state.isActive && 'is-active')} />
          </div>
        </div>
      </Container>
    )
  }
}

Switch.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    dark: PropTypes.bool,
  })),
  onInput: PropTypes.func,
}

Switch.defaultProps = {
  options: [{
    value: false,
    strong: false,
  }, {
    value: true,
    strong: true,
  }],
}

export default Switch
