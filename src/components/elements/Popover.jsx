import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"

import vars from "../../variables.js"
import Transition from "react-transition-group/Transition"

export const StyledPopover = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 2;
  pointer-events: none;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));

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

    background-color: ${(props) =>
      props.theme.lightness === "light" ? vars.white : vars.grey_0};
    overflow: auto;
    pointer-events: auto;
    border-radius: ${vars.radius};
    overflow: auto;
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
    fill: ${(props) =>
      props.theme.lightness === "light" ? vars.white : vars.grey_0};
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

const Popover = (props) => {
  const [openDirection, setOpenDirection] = useState("up")
  const [horizontalOffset, setHorizontalOffset] = useState(null)
  const [verticalOffset, setVerticalOffset] = useState(null)
  const [centeredHorizontalOffset, setCenteredHorizontalOffset] = useState(null)
  const [centeredVerticalOffset, setCenteredVerticalOffset] = useState(null)
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)
  const [viewportMargin, setViewportMargin] = useState(6)
  const [viewportLayout, setViewportLayout] = useState(null)
  const [elementLayout, setElementLayout] = useState(null)
  const [containerLayout, setContainerLayout] = useState(null)

  const rootElement = useRef(null)
  const containerElement = useRef(null)

  useEffect(() => {
    if (props.isOpen) {
      entered()
    }
    return () => {
      removeOutsideClickListener()
      removeResizeListener()
    }
  })

  //

  const entered = () => {
    calcLayout()

    addOutsideClickListener()
    addResizeListener()
  }

  const leaved = () => {
    removeOutsideClickListener()
    removeResizeListener()
  }

  //

  const calcLayout = () => {
    updateViewportLayout()
    updateElementLayout()
    updateContainerLayout()

    if (props.direction) {
      setOpenDirection(props.direction)
    } else {
      setOpenDirection(getDirection(getAvailableDirections()))
    }

    setOffset()
  }

  const updateViewportLayout = () => {
    const rectangle = props.viewport
      ? props.viewport.getBoundingClientRect()
      : null

    setViewportLayout({
      width: props.viewport ? props.viewport.clientWidth : window.innerWidth,
      height: props.viewport ? props.viewport.clientHeight : window.innerHeight,
      top: props.viewport
        ? rectangle.top + document.documentElement.scrollTop
        : 0,
      left: props.viewport
        ? rectangle.left + document.documentElement.scrollLeft
        : 0,
    })
  }

  const updateElementLayout = () => {
    const rectangle = rootElement.current.getBoundingClientRect()
    console.log({ rectangle, viewportLayout })

    setElementLayout({
      top: rectangle.top - viewportLayout.top,
      left: rectangle.left - viewportLayout.left,
      height: rootElement.current.clientHeight,
      width: rootElement.current.clientWidth,
    })
  }

  const updateContainerLayout = () => {
    setContainerLayout({
      width: containerElement.current.clientWidth,
      height: containerElement.current.clientHeight,
    })
  }

  //

  const getAvailableDirections = () => {
    const dropdownArrowHeight = 14
    const dropdownHeight = containerLayout.height + dropdownArrowHeight

    const offsets = {
      top: elementLayout.top,
      bottom: viewportLayout.height - elementLayout.bottom,
    }

    return {
      up: offsets.top - dropdownHeight > 0,
      down: offsets.bottom - dropdownHeight > 0,
      preferred:
        offsets.bottom - dropdownHeight < offsets.top - dropdownHeight
          ? "up"
          : "down",
    }
  }

  const getDirection = (availableDirections) => {
    if (
      (availableDirections.up && availableDirections.down) ||
      availableDirections.up
    ) {
      return "up"
    } else if (!availableDirections.up && !availableDirections.down) {
      return availableDirections.preferred
    } else {
      return "down"
    }
  }

  const getHorizontalOffset = () => {
    const dropdownWidth = containerLayout.width
    const dropdownOrigin = elementLayout.left + elementLayout.width / 2

    const leftOffset =
      dropdownOrigin - dropdownWidth / 2 - viewportMargin.current
    const rightOffset =
      viewportLayout.width -
      dropdownOrigin -
      dropdownWidth / 2 -
      viewportMargin.current

    if (
      (leftOffset < 0 && rightOffset < 0) ||
      (leftOffset >= 0 && rightOffset >= 0)
    )
      return 0
    if (leftOffset < 0) return leftOffset * -1
    if (rightOffset < 0) return rightOffset
  }

  const getVerticalOffset = () => {
    const dropdownHeight = containerLayout.height
    const dropdownOrigin = elementLayout.top + elementLayout.height / 2

    const topOffset =
      dropdownOrigin - dropdownHeight / 2 - viewportMargin.current
    const bottomOffset =
      viewportLayout.height -
      dropdownOrigin -
      dropdownHeight / 2 -
      viewportMargin.current

    if (
      (topOffset < 0 && bottomOffset < 0) ||
      (topOffset >= 0 && bottomOffset >= 0)
    )
      return 0
    if (topOffset < 0) return topOffset * -1
    if (bottomOffset < 0) return bottomOffset
  }

  const isHorizontal = (input) => ["left", "right"].includes(input)

  const isVertical = (input) => ["up", "down"].includes(input)

  const getCenteredHorizontalOffset = () => {
    if (
      isVertical(openDirection) &&
      horizontalOffset !== null &&
      containerLayout
    ) {
      return Math.floor(horizontalOffset - containerLayout.width / 2)
    } else return 0
  }

  const getCenteredVerticalOffset = () => {
    if (
      isHorizontal(openDirection) &&
      verticalOffset !== null &&
      containerLayout
    ) {
      return Math.floor(verticalOffset - containerLayout.height / 2)
    } else return 0
  }

  const setOffset = () => {
    if (isVertical(openDirection)) {
      setHorizontalOffset(getHorizontalOffset())
      setCenteredHorizontalOffset(getCenteredHorizontalOffset())
      setVerticalOffset(0)
      setCenteredVerticalOffset(0)
    } else if (isHorizontal(openDirection)) {
      setVerticalOffset(getVerticalOffset())
      setCenteredVerticalOffset(getCenteredVerticalOffset())
      setHorizontalOffset(0)
      setCenteredHorizontalOffset(0)
    }
  }

  //

  const clicked = ($event) => {
    const popoverElements = [
      rootElement.current,
      ...(props.includeElements || []),
    ]

    const clickedInside = popoverElements.some(
      (el) => el.contains($event.target) || el === $event.target
    )

    if (!clickedInside) {
      props.onClickOutside()
    }
  }

  const resized = () => {
    calcLayout()
  }

  //

  const addOutsideClickListener = () => {
    document.documentElement.addEventListener("mousedown", clicked, true)
  }

  const removeOutsideClickListener = () => {
    document.documentElement.removeEventListener("mousedown", clicked, true)
  }

  const addResizeListener = () => {
    window.addEventListener("resize", resized)
  }

  const removeResizeListener = () => {
    window.removeEventListener("resize", resized)
  }

  return (
    <Transition
      in={props.isOpen}
      onEnter={() => {
        entered()
      }}
      onExit={() => {
        leaved()
      }}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={{
        enter: 300,
        exit: 500,
      }}
    >
      <StyledPopover
        {...props}
        ref={rootElement}
        className={`popover is-${openDirection} ${props.isOpen && "is-open"}`}
      >
        <div
          className="popover-container"
          ref={containerElement}
          style={{
            width: width,
            height: height,
            marginLeft: `${centeredHorizontalOffset}px`,
            marginTop: `${centeredVerticalOffset}px`,
          }}
        >
          {props.children}
        </div>

        <svg className="arrow" viewBox="0 0 20 20">
          <path d="M0,0 10,10 20,0" />
        </svg>
      </StyledPopover>
    </Transition>
  )
}

export default Popover
