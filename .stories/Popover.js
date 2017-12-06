import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import {
  Popover,
} from '@/components'

class Wrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      x: 20,
      y: 20,
    }

    this.togglePopover = this.togglePopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  togglePopover () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  closePopover () {
    this.setState({
      isOpen: false
    })
  }

  onMouseDown (e) {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)

    const box = this.containerElement.getBoundingClientRect()

    this.initialX = e.pageX - box.left
    this.initialY = e.pageY - box.top
  }

  onMouseMove (e) {
    this.setState({
      x: e.pageX - this.initialX,
      y: e.pageY - this.initialY,
    })
  }

  onMouseUp () {
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
  }

  render () {
    return (
      <div
        ref={(e) => this.containerElement = e}
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          left: this.state.x + 'px',
          top: this.state.y + 'px',
          background: 'blue',
          width: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'green',
            cursor: 'move',
          }}
          onMouseDown={this.onMouseDown}
        >
          <div>
            Move Popover
          </div>
          <button
            onClick={this.togglePopover}
            checked={this.state.isOpen}
            ref={(e) => this.buttonElement = e}
          >Open Popover</button>
        </div>

        <Popover
          isOpen={this.state.isOpen}
          onClickOutside={this.closePopover}
          includeElements={[this.buttonElement]}
        >
          Hi everyone it's me
        </Popover>
      </div>
    )
  }
}

storiesOf('Popover', module)
  .add('basic', () => {
    return (
      <Wrapper />
    )
  })
