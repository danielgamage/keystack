import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '../main.js'

class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      titleFocus: false,
      draggingItem: false
    }
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
    this.setState({
      draggingItem: true
    })
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
    this.setState({
      draggingItem: false
    })
    this.props.dispatch({
      type: 'UPDATE_VIEW',
      property: 'dragging',
      value: false
    })
    this.props.dispatch({
      type: `MOVE_DEVICE`,

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
        className={`item item-${this.props.type} ${this.state.draggingItem ? 'dragging' : ''}`}
        >
        <header
          onMouseDown={(e) => {
            document.addEventListener('mousemove', this.handleDrag)
            document.addEventListener('mouseup', this.handleMouseUp)
            document.addEventListener('mouseleave', this.handleMouseUp)
          }}
          >
          <div className='title item-title'>
            <h3
              onMouseDown={(e) => {
                this.mouseDownX = e.pageX
                this.mouseDownY = e.pageY
              }}
              onMouseUp={(e) => {
                if (this.mouseDownX === e.pageX && this.mouseDownY === e.pageY) {
                  this.titleInput.focus()
                }
              }}
              className={this.state.titleFocus ? '' : 'active'}
              >{this.props.item.name}</h3>
            <input
              ref={t => this.titleInput = t}
              className={this.state.titleFocus ? 'active' : ''}
              onFocus={() => {
                this.setState({
                  titleFocus: true
                })
                unbindKeyboardEvents()
              }}
              onBlur={() => {
                this.setState({
                  titleFocus: false
                })
                bindKeyboardEvents()
              }}
              onInput={(e) => {
                this.props.dispatch({
                  type: `UPDATE_${this.props.type.toUpperCase()}_ITEM`,
                  id: this.props.item.id,
                  property: 'name',
                  value: e.target.value
                })
              }}
              type='text'
              value={this.props.item.name} />
          </div>
          <div className='aux'>
            {this.props.headerChildren}
          </div>
          <button
            className='button'
            onClick={() => {
              this.props.dispatch({
                type: `REMOVE_DEVICE`,
                id: this.props.item.id
              })
            }}
            >
            Remove
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
