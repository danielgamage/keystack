import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '../main.js'

class Item extends Component {
  constructor (props) {
    super(props)
    this.getDragIndex = this.getDragIndex.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.turnOffHR = this.turnOffHR.bind(this)
  }
  getDragIndex (e) {
    const items = [...document.querySelectorAll(`.item-${this.props.type}`)]
    let dragIndex
    if (items.some((box, i) => { // use some to return as soon as a match is found
      dragIndex = i
      const bounds = box.getBoundingClientRect()
      const midline = bounds.top + (bounds.height / 2)
      return e.pageY < (bounds.top + (bounds.height / 2))
    })) {
      return dragIndex
    } else {
      return items.length
    }
  }
  handleDrag (e) {
    e.preventDefault()
    const index = this.getDragIndex(e)
    const curHR = document.querySelector(`hr.active`)
    const newHR = document.querySelector(`.${this.props.type}-${index}`)
    if (newHR !== curHR) {
      this.turnOffHR()
      newHR.classList.add(`active`)
      this.props.dispatch({
        type: 'UPDATE_VIEW',
        property: 'dragging',
        value: true
      })
    }
  }
  handleMouseUp (e) {
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mouseleave', this.handleMouseUp)
    this.turnOffHR()
    const index = this.getDragIndex(e)
    this.props.dispatch({
      type: 'UPDATE_VIEW',
      property: 'dragging',
      value: false
    })
    console.log('this.props.index', this.props.index)
    this.props.dispatch({
      type: `MOVE_${this.props.type.toUpperCase()}_ITEM`,
      oldIndex: this.props.index,
      newIndex: index
    })
  }
  turnOffHR () {
    const activeHR = document.querySelector(`hr.active`)
    if (activeHR) {
      activeHR.classList.remove(`active`)
    }
  }
  render () {
    return (
      <div
        className={`item item-${this.props.type}`}
        >
        <header
          onMouseDown={(e) => {
            this.mouseDown = true
            document.addEventListener('mousemove', this.handleDrag)
            document.addEventListener('mouseup', this.handleMouseUp)
            document.addEventListener('mouseleave', this.handleMouseUp)
          }}
          >
          <h3
            onFocus={() => {
              unbindKeyboardEvents()
            }}
            onBlur={() => {
              bindKeyboardEvents()
            }}
            onInput={(e) => {
              this.props.dispatch({
                type: `UPDATE_${this.props.type.toUpperCase()}_ITEM`,
                id: this.props.item.id,
                property: 'name',
                value: e.target.textContent
              })
            }}
            contentEditable
            className='title item-title'
            >{this.props.item.name}</h3>
          {this.props.headerChildren}
          <button
            className='button'
            onClick={() => {
              this.props.dispatch({
                type: `REMOVE_${this.props.type.toUpperCase()}_ITEM`,
                id: this.props.item.id
              })
            }}
            >
            Delete
          </button>
        </header>
        <div className='item-body'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect()(Item)
