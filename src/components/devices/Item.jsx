import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '@/utils/keyboard'

class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      titleFocus: false,
      dragging: false
    }
    this.index = 0
    this.getDragIndex = this.getDragIndex.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }
  getDragIndex (e) {
    const items = [...document.querySelectorAll(`.item`)]
    let dragIndex
    if (items.some((box, i) => { // use some to return as soon as a match is found
      dragIndex = i
      const bounds = box.getBoundingClientRect()
      const midline = bounds.top + (bounds.height / 2)
      return e.pageY < midline
    })) {
      return dragIndex
    } else {
      return items.length
    }
  }
  handleDrag (e) {
    e.preventDefault()
    const index = this.getDragIndex(e)

    if (!this.state.dragging) {
      document.body.classList.add('cursor--move')
      this.setState({
        dragging: true
      })
    }
    if (index !== this.index) {
      this.props.dispatch({
        type: 'UPDATE_VIEW',
        property: 'dragging',
        value: true
      })
      this.props.dispatch({
        type: `MOVE_DEVICE`,
        id: this.props.item.id,
        newIndex: index
      })
    }
    this.index = index
  }
  handleMouseUp (e) {
    document.removeEventListener('mousemove', this.handleDrag)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mouseleave', this.handleMouseUp)
    document.body.classList.remove('cursor--move')
    this.setState({
      dragging: false
    })
    this.props.dispatch({
      type: 'UPDATE_VIEW',
      property: 'dragging',
      value: false
    })
  }
  render () {
    return (
      <div
        className={`item item-${this.props.type} ${this.state.dragging ? 'dragging' : ''}`}
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
              onChange={(e) => {
                this.props.dispatch({
                  type: `UPDATE_DEVICE`,
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
