import React, { useState, useEffect, useRef } from "react"
import { useClickOutside, useWindowResize } from "../../hooks"
import useMeasure from "react-use-measure"
import mergeRefs from "react-merge-refs"
import styled from "styled-components"

export const StyledPopover = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 101;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.98);
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
  will-change: transform;
  transform: translate3d(0, 0, 0);
  transition: opacity 0.4s var(--easeOut);

  &.is-open {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.1s var(--easeOut);
  }
  &.is-open .container,
  &.is-open .arrow {
    pointer-events: auto;
  }

  &.is-mouse-disabled .container,
  &.is-mouse-disabled .arrow {
    pointer-events: none;
  }

  // This breaks out of overflow: hidden / auto containers
  .fixed-root {
    position: fixed;
  }

  .container {
    position: absolute;
    min-width: 2rem;
    min-height: 2rem;
    max-width: calc(100vw - 2rem);
    max-height: calc(100vw - 2rem);
    width: max-content;

    overflow: auto;
    pointer-events: none;
    background: var(--bg-elevated);
    border-radius: var(--radius-large);
  }

  &.is-up {
    .container {
      left: 50%;
      bottom: calc(100% + 14px);
    }
    .arrow {
      left: 50%;
      bottom: 100%;
      transform: translate(-50%, 5px);
    }
  }

  &.is-down {
    .container {
      left: 50%;
      top: calc(100% + 14px);
    }
    .arrow {
      left: 50%;
      top: 100%;
      transform: translate(-50%, -5px) rotate(180deg);
    }
  }

  &.is-left {
    .container {
      top: 50%;
      right: calc(100% + 14px);
    }
    .arrow {
      top: 50%;
      right: 100%;
      transform: translate(5px, -50%) rotate(-90deg);
    }
  }

  &.is-right {
    .container {
      top: 50%;
      left: calc(100% + 14px);
    }
    .arrow {
      top: 50%;
      left: 100%;
      transform: translate(-5px, -50%) rotate(90deg);
    }
  }

  .arrow {
    position: absolute;
    width: 20px;
    height: 20px;

    z-index: 1;
    pointer-events: none;
    speak: never;
    fill: var(--bg-elevated);
  }
`
export interface IPopoverProps {
  isOpen: any
  direction?: any
  onClickOutside?: Function
  children: React.ReactNode
  mouseDisabled?: boolean
  arrow?: boolean
}

export const Popover = ({
  onClickOutside = () => {},
  children = "",
  direction = "up",
  isOpen = false,
  arrow = false,
  mouseDisabled,
}: IPopoverProps) => {
  //
  // state
  const [openDirection, setOpenDirection] = useState(direction)
  const [centeredHorizontalOffset, setCenteredHorizontalOffset] = useState(0)
  const [centeredVerticalOffset, setCenteredVerticalOffset] = useState(0)

  const [horizontalOffset, setHorizontalOffset] = useState(0)
  const [verticalOffset, setVerticalOffset] = useState(0)
  const rootLayout = useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  })
  const [containerMeasureRef, containerLayout] = useMeasure()
  const rootRef = useRef(null)
  const containerRef = useRef(null)

  const viewportMargin = 8
  let viewportLayout = useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  })

  //
  // lifecycle
  useClickOutside(rootRef, () => {
    if (isOpen) {
      onClickOutside()
    }
  })
  useWindowResize(() => updateViewportLayout)

  useEffect(() => {
    updateViewportLayout()
    updateRootLayout()

    const availableDirections = getAvailableDirections()

    setOpenDirection(getDirection(availableDirections))

    setOffset()
  })

  useEffect(() => {
    const availableDirections = getAvailableDirections()
    setOpenDirection(getDirection(availableDirections))

    setOffset()
  }, [isOpen, rootLayout, containerLayout, viewportLayout])

  //
  //
  //

  const updateViewportLayout = () => {
    viewportLayout.current = {
      width: window.innerWidth,
      height: window.innerHeight,
      top: document.documentElement.scrollTop,
      left: document.documentElement.scrollLeft,
    }
  }

  const updateRootLayout = () => {
    const layout = (rootRef.current as any)?.getBoundingClientRect()
    rootLayout.current = {
      width: layout.width,
      height: layout.height,
      top: layout.top,
      left: layout.left,
      bottom: layout.bottom,
      right: layout.right,
    }
  }

  const getAvailableDirections = () => {
    const dropdownArrowHeight = 14
    const dropdownHeight = containerLayout.height + dropdownArrowHeight

    const offsets = {
      top: rootLayout.current.top,
      bottom: viewportLayout.current.height - rootLayout.current.bottom || 0,
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

  const getDirection = (availableDirections: {
    up: boolean
    down: boolean
    preferred: string
  }) => {
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

  const getHorizontalOffset = (): number => {
    const dropdownWidth = containerLayout.width
    const dropdownOrigin =
      rootLayout.current.left + rootLayout.current.width / 2

    const leftOffset = dropdownOrigin - dropdownWidth / 2 - viewportMargin
    const rightOffset =
      viewportLayout.current.width -
        dropdownOrigin -
        dropdownWidth / 2 -
        viewportMargin || 0

    if (
      (leftOffset < 0 && rightOffset < 0) ||
      (leftOffset >= 0 && rightOffset >= 0)
    )
      return 0
    if (leftOffset < 0) return leftOffset * -1
    if (rightOffset < 0) return rightOffset
    return 0
  }

  const getVerticalOffset = () => {
    const dropdownHeight = containerLayout.height
    const dropdownOrigin =
      rootLayout.current.top + rootLayout.current.height / 2

    const topOffset = dropdownOrigin - dropdownHeight / 2 - viewportMargin
    const bottomOffset =
      viewportLayout.current.height -
      dropdownOrigin -
      dropdownHeight / 2 -
      viewportMargin

    if (
      (topOffset < 0 && bottomOffset < 0) ||
      (topOffset >= 0 && bottomOffset >= 0)
    )
      return 0
    if (topOffset < 0) return topOffset * -1
    if (bottomOffset < 0) return bottomOffset
    return 0
  }

  const getCenteredHorizontalOffset = () => {
    if (
      ["up", "down"].includes(openDirection) &&
      horizontalOffset !== null &&
      containerLayout
    ) {
      return Math.floor(horizontalOffset - containerLayout.width / 2)
    } else return 0
  }

  const getCenteredVerticalOffset = () => {
    if (
      ["left", "right"].includes(openDirection) &&
      verticalOffset !== null &&
      containerLayout
    ) {
      return Math.floor(verticalOffset - containerLayout.height / 2)
    } else return 0
  }

  const setOffset = () => {
    if (["up", "down"].includes(openDirection)) {
      setHorizontalOffset(getHorizontalOffset())
      setCenteredHorizontalOffset(getCenteredHorizontalOffset())
      setVerticalOffset(0)
      setCenteredVerticalOffset(0)
    } else if (["left", "right"].includes(openDirection)) {
      setVerticalOffset(getVerticalOffset())
      setCenteredVerticalOffset(getCenteredVerticalOffset())
      setHorizontalOffset(0)
      setCenteredHorizontalOffset(0)
    }
  }

  //
  //
  //

  return (
    <StyledPopover
      ref={rootRef}
      className={`Popover is-${openDirection} ${isOpen && "is-open"} ${
        mouseDisabled && "is-mouse-disabled"
      }`}
    >
      <div
        // This breaks out of any scroll context by using position: fixed without
        // any additional positioning (top/right/bottom/left) properties
        className="fixed-root"
        style={{
          width: rootLayout.current.width + "px",
          height: rootLayout.current.height + "px",
        }}
      >
        <div
          className="container"
          ref={mergeRefs([containerRef, containerMeasureRef])}
          style={{
            marginLeft: `${centeredHorizontalOffset}px`,
            marginTop: `${centeredVerticalOffset}px`,
          }}
        >
          {children}
        </div>

        {arrow && (
          <svg className="arrow" viewBox="0 0 20 20">
            <path d="M0,0 10,10 20,0" />
          </svg>
        )}
      </div>
    </StyledPopover>
  )
}

export default Popover
