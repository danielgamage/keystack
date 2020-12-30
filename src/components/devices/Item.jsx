import React, { Component } from "react"
import { connect } from "react-redux"
import { bindKeyboardEvents, unbindKeyboardEvents } from "utils/keyboard"
import { Button, Text, Icon, RemoveButton } from "components"
import xIcon from "images/icon/x.svg"

import styled from "styled-components"
import vars from "variables"

const StyledItem = styled.div`
  transition: height 0.3s ease, background 0.4s ease;
  margin: 0 -2rem;
  padding: 1rem 2rem;
  background-color: var(--bg-recessed);
  &.selected,
  &.dragging {
    background-color: var(--bg-recessed);
  }
  .item-header {
    cursor: move;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    line-height: 1;
    .title {
      position: relative;
      -webkit-font-smoothing: antialiased;
      h3,
      input {
        font-size: 1.3rem;
        font-weight: 700;
        line-height: 1;
        opacity: 0;
        &.active {
          opacity: 1;
          pointer-events: all;
        }
      }
      h3 {
        margin: 0;
      }
      input {
        position: absolute;
        padding: 0.5rem;
        top: -0.5rem;
        right: -0.5rem;
        bottom: -0.5rem;
        left: -0.5rem;
        width: calc(100% + 1rem);
        border: 0;
        background: none;
        color: inherit;
        pointer-events: none;
      }
    }
  }
  section {
    margin-bottom: 1rem;
  }
  .item-body {
    transition: opacity 0.2s ease;
  }
`

class Item extends Component {
  constructor(props) {
    super(props)
    this.state = {
      titleFocus: false,
      dragging: false,
    }
    this.index = 0
    this.getDragIndex = this.getDragIndex.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }
  getDragIndex(e) {
    const items = [...document.querySelectorAll(`.item`)]
    let dragIndex
    if (
      items.some((box, i) => {
        // use some to return as soon as a match is found
        dragIndex = i
        const bounds = box.getBoundingClientRect()
        const midline = bounds.top + bounds.height / 2
        return e.pageY < midline
      })
    ) {
      return dragIndex
    } else {
      return items.length
    }
  }
  handleDrag(e) {
    e.preventDefault()
    const index = this.getDragIndex(e)

    if (!this.state.dragging) {
      document.body.classList.add("cursor--move")
      this.setState({
        dragging: true,
      })
    }
    if (index !== this.index) {
      this.props.dispatch({
        type: "UPDATE_VIEW",
        property: "dragging",
        value: true,
      })
      this.props.dispatch({
        type: `MOVE_DEVICE`,
        id: this.props.item.id,
        newIndex: index,
      })
    }
    this.index = index
  }
  handleMouseUp(e) {
    document.removeEventListener("mousemove", this.handleDrag)
    document.removeEventListener("mouseup", this.handleMouseUp)
    document.removeEventListener("mouseleave", this.handleMouseUp)
    document.body.classList.remove("cursor--move")
    this.setState({
      dragging: false,
    })
    this.props.dispatch({
      type: "UPDATE_VIEW",
      property: "dragging",
      value: false,
    })
  }
  render() {
    return (
      <StyledItem
        className={`item item-${this.props.type} ${
          this.state.dragging ? "dragging" : ""
        }`}
      >
        <header
          className="item-header"
          onMouseDown={(e) => {
            document.addEventListener("mousemove", this.handleDrag)
            document.addEventListener("mouseup", this.handleMouseUp)
            document.addEventListener("mouseleave", this.handleMouseUp)
          }}
        >
          <h3 className="h2 title item-title">
            <div
              onMouseDown={(e) => {
                this.mouseDownX = e.pageX
                this.mouseDownY = e.pageY
              }}
              onMouseUp={(e) => {
                if (
                  this.mouseDownX === e.pageX &&
                  this.mouseDownY === e.pageY
                ) {
                  this.titleInput.focus()
                }
              }}
              className={this.state.titleFocus ? "" : "active"}
            >
              {this.props.item.name}
            </div>

            <input
              ref={(t) => (this.titleInput = t)}
              className={this.state.titleFocus ? "active" : ""}
              onFocus={() => {
                this.setState({
                  titleFocus: true,
                })
                unbindKeyboardEvents()
              }}
              onBlur={() => {
                this.setState({
                  titleFocus: false,
                })
                bindKeyboardEvents()
              }}
              onChange={(e) => {
                this.props.dispatch({
                  type: `UPDATE_DEVICE`,
                  id: this.props.item.id,
                  property: "name",
                  value: e.target.value,
                })
              }}
              type="text"
              value={this.props.item.name}
            />
          </h3>
          <div className="aux">{this.props.headerChildren}</div>
          <RemoveButton
            onClick={() => {
              this.props.dispatch({
                type: `REMOVE_DEVICE`,
                id: this.props.item.id,
              })
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
            title="remove device"
          />
        </header>
        <div className="item-body">{this.props.children}</div>
      </StyledItem>
    )
  }
}

export default connect()(Item)
