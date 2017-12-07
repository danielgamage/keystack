import React from 'react'
import styled from 'styled-components'

import vars from '../../variables.js'
import Transition from 'react-transition-group/Transition'

export const StyledPopover = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 2;
  pointer-events: none;
  opacity: 0;
  border-radius: 4px;
  filter: drop-shadow(0 0 8px rgba(0,0,0,0.2));

  &.is-open {
    opacity: 1;
    .container {
      pointer-events: auto;
    }
  }

  .popover-container {
    position: absolute;
    min-width: 24px;
    min-height: 24px;
    max-width: calc(100vw - 32px);
    max-height: calc(100vw - 32px);

    background-color: ${vars.white};
    overflow: auto;
    pointer-events: auto;
  }

  &.is-up .popover-container {
    left: 50%;
    bottom: calc(100% + 14px);
  }

  &.is-down .popover-container {
    left: 50%;
    top: calc(100% + 14px);
  }

  &.is-left .popover-container {
    top: 50%;
    right: calc(100% + 14px);
  }

  &.is-right .popover-container {
    top: 50%;
    left: calc(100% + 14px);
  }

  /**/
  /**/
  /**/

  .arrow {
    position: absolute;
    width: 20px;
    height: 20px;

    z-index: 1;
    pointer-events: auto;
    fill: ${vars.white};
  }

  &.is-up .arrow {
    left: 50%;
    bottom: 100%;
    transform: translate(-50%, 5px);
  }

  &.is-down .arrow {
    left: 50%;
    top: 100%;
    transform: translate(-50%, -5px) rotate(180deg);
  }

  &.is-left .arrow {
    top: 50%;
    right: 100%;
    transform: translate(5px, -50%) rotate(-90deg);
  }

  &.is-right .arrow {
    top: 50%;
    left: 100%;
    transform: translate(-5px, -50%) rotate(90deg);
  }
`

class Popover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openDirection: 'up',
      horizontalOffset: null,
      verticalOffset: null,
      centeredHorizontalOffset: null,
      centeredVerticalOffset: null,
      width: null,
      height: null,

      viewportMargin: 6,
      viewportLayout: null,
      elementLayout: null,
      containerLayout: null,
    }

    this.entered = this.entered.bind(this)
    this.leaved = this.leaved.bind(this)
    this.calcLayout = this.calcLayout.bind(this)
    this.setViewportLayout = this.setViewportLayout.bind(this)
    this.setElementLayout = this.setElementLayout.bind(this)
    this.setContainerLayout = this.setContainerLayout.bind(this)
    this.getAvailableDirections = this.getAvailableDirections.bind(this)
    this.getHorizontalOffset = this.getHorizontalOffset.bind(this)
    this.getVerticalOffset = this.getVerticalOffset.bind(this)
    this.getCenteredHorizontalOffset = this.getCenteredHorizontalOffset.bind(this)
    this.getCenteredVerticalOffset = this.getCenteredVerticalOffset.bind(this)
    this.setOffset = this.setOffset.bind(this)
    this.resized = this.resized.bind(this)
    this.getDirection = this.getDirection.bind(this)
    this.clicked = this.clicked.bind(this)
    this.addOutsideClickListener = this.addOutsideClickListener.bind(this)
    this.removeOutsideClickListener = this.removeOutsideClickListener.bind(this)
    this.addResizeListener = this.addResizeListener.bind(this)
    this.removeResizeListener = this.removeResizeListener.bind(this)
  }

  //
  //
  //


  componentDidMount () {
    if (this.props.isOpen) {
      console.log('onMount')
      this.entered()
    }
  }

  componentWillUnmount () {
    this.removeOutsideClickListener()
    this.removeResizeListener()
  }

  //
  //
  //

  entered () {
    console.log('entered')

    this.calcLayout()

    this.addOutsideClickListener()
    this.addResizeListener()
  }

  leaved () {
    console.log('leaved')

    this.removeOutsideClickListener()
    this.removeResizeListener()
  }

  //
  //
  //

  calcLayout () {
    console.log('calcLayout')
    this.setViewportLayout()
    this.setElementLayout()
    this.setContainerLayout()

    if (this.props.direction) {
      this.setState({
        openDirection: this.props.direction
      })
    } else {
      const availableDirections = this.getAvailableDirections()
      this.setState({
        openDirection: this.getDirection(availableDirections)
      })
    }

    this.setOffset()
  }

  setViewportLayout () {
    const rectangle = this.props.viewport ? this.props.viewport.getBoundingClientRect() : null

    this.viewportLayout = {
      width: this.props.viewport
        ? this.props.viewport.clientWidth
        : window.innerWidth,
      height: this.props.viewport
        ? this.props.viewport.clientHeight
        : window.innerHeight,
      top: this.props.viewport
        ? rectangle.top + document.documentElement.scrollTop
        : 0,
      left: this.props.viewport
        ? rectangle.left + document.documentElement.scrollLeft
        : 0
    }
  }

  setElementLayout () {
    const rectangle = this.rootElement.getBoundingClientRect()

    console.log(this.state, rectangle)

    this.elementLayout = {
      top: rectangle.top - this.viewportLayout.top,
      left: rectangle.left - this.viewportLayout.left,
      height: this.rootElement.clientHeight,
      width: this.rootElement.clientWidth,
    }
  }

  setContainerLayout () {
    this.containerLayout = {
      width: this.containerElement.clientWidth,
      height: this.containerElement.clientHeight,
    }
  }

  //
  //
  //

  getAvailableDirections () {
    const dropdownArrowHeight = 14
    const dropdownHeight = this.containerLayout.height + dropdownArrowHeight

    const offsets = {
      top: this.elementLayout.top,
      bottom: this.viewportLayout.height - this.elementLayout.bottom,
    }

    return {
      up: (offsets.top - dropdownHeight > 0),
      down: (offsets.bottom - dropdownHeight > 0),
      preferred: (offsets.bottom - dropdownHeight) < (offsets.top - dropdownHeight)
        ? 'up'
        : 'down'
    }
  }

  getDirection (availableDirections) {
    if (
      (availableDirections.up && availableDirections.down) ||
      (availableDirections.up)
    ) {
      return 'up'
    } else if (!availableDirections.up && !availableDirections.down) {
      return availableDirections.preferred
    } else {
      return 'down'
    }
  }

  getHorizontalOffset () {
    const dropdownWidth = this.containerLayout.width
    const dropdownOrigin = this.elementLayout.left + this.elementLayout.width / 2

    const leftOffset = dropdownOrigin - (dropdownWidth / 2) - this.state.viewportMargin
    const rightOffset = this.viewportLayout.width - dropdownOrigin - (dropdownWidth / 2) - this.state.viewportMargin

    if (
      (leftOffset < 0 && rightOffset < 0) ||
      (leftOffset >= 0 && rightOffset >= 0)
    ) return 0
    if (leftOffset < 0) return (leftOffset * -1)
    if (rightOffset < 0) return rightOffset
  }

  getVerticalOffset () {
    const dropdownHeight = this.containerLayout.height
    const dropdownOrigin = this.elementLayout.top + this.elementLayout.height / 2

    const topOffset = dropdownOrigin - (dropdownHeight / 2) - this.state.viewportMargin
    const bottomOffset = this.viewportLayout.height - dropdownOrigin - (dropdownHeight / 2) - this.state.viewportMargin

    if (
      (topOffset < 0 && bottomOffset < 0) ||
      (topOffset >= 0 && bottomOffset >= 0)
    ) return 0
    if (topOffset < 0) return (topOffset * -1)
    if (bottomOffset < 0) return bottomOffset
  }

  getCenteredHorizontalOffset () {
    if (['up', 'down'].includes(this.state.openDirection) && this.state.horizontalOffset !== null && this.containerLayout) {
      return Math.floor(this.state.horizontalOffset - this.containerLayout.width / 2)
    } else return 0
  }

  getCenteredVerticalOffset () {
    if (['left', 'right'].includes(this.state.openDirection) && this.state.verticalOffset !== null && this.containerLayout) {
      return Math.floor(this.state.verticalOffset - this.containerLayout.height / 2)
    } else return 0
  }

  setOffset () {
    console.log('setOffset', this.state.openDirection)

    if (['up', 'down'].includes(this.state.openDirection)) {
      this.setState({
        horizontalOffset: this.getHorizontalOffset(),
        centeredHorizontalOffset: this.getCenteredHorizontalOffset(),
        verticalOffset: 0,
        centeredVerticalOffset: 0,
      })
    } else if (['left', 'right'].includes(this.state.openDirection)) {
      this.setState({
        verticalOffset: this.getVerticalOffset(),
        centeredVerticalOffset: this.getCenteredVerticalOffset(),
        horizontalOffset: 0,
        centeredHorizontalOffset: 0,
      })
    }
  }

  //
  //
  //

  clicked ($event) {
    const popoverElements = [
      this.rootElement,
      ...(this.props.includeElements || [])
    ]

    console.log({
      includeElements: this.props.includeElements,
      target: $event.target,
      popoverElements,
    })

    const clickedInside = popoverElements.some((el) => (
      el.contains($event.target) ||
      el === $event.target
    ))

    if (!clickedInside) {
      console.log('clickedOutside')
      this.props.onClickOutside()
    }
  }

  resized () {
    this.setOffset()
  }

  //
  //
  //

  addOutsideClickListener () {
    document.documentElement.addEventListener(
      'mousedown',
      this.clicked,
      true
    )
  }

  removeOutsideClickListener () {
    document.documentElement.removeEventListener(
      'mousedown',
      this.clicked,
      true
    )
  }

  addResizeListener () {
    window.addEventListener('resize', this.resized)
  }

  removeResizeListener () {
    window.removeEventListener('resize', this.resized)
  }

  render () {
    return (
      <Transition
        in={this.props.isOpen}
        onEnter={() => {this.entered()}}
        onExit={() => {this.leaved()}}
        timeout={{
          enter: 300,
          exit: 500,
        }}
      >
        <StyledPopover
          {...this.props}
          innerRef={(e) => {this.rootElement = e}}
          className={'popover' + ` is-${this.state.openDirection}` + ` ${this.props.isOpen && 'is-open'}`}
        >
          <div
            className='popover-container'
            ref={(e) => {this.containerElement = e}}
            style={{
              width: this.state.width,
              height: this.state.height,
              marginLeft: `${this.state.centeredHorizontalOffset}px`,
              marginTop: `${this.state.centeredVerticalOffset}px`,
            }}
          >
            {this.props.children}
          </div>

          <svg
            className='arrow'
            viewBox='0 0 20 20'
          >
            <path d='M0,0 10,10 20,0' />
          </svg>
        </StyledPopover>
      </Transition>
    )
  }
}

export default Popover
