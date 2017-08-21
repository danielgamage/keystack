import React, { Component } from 'react'
import { connect } from 'react-redux'

class AddButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
  render () {
    return (
      <div
        onClick={() => {
          this.setState({open: !this.state.open})
        }}
        className={`add-item ${(this.state.open === true) ? 'open' : 'closed'}`}
        >
        {this.state.open
          ? Object.keys(this.props.schema).map(item => (
            <button
              onClick={() => {
                this.props.dispatch({
                  type: this.props.action,
                  index: this.props.index,
                  value: item
                })
              }}
              className='add-item-option'
              >{item}</button>
          ))
          : <button className='add-item-toggle'>+</button>
        }
      </div>
    )
  }
}

export default connect()(AddButton)
