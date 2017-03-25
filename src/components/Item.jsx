import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from '../main.js'

class Item extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div
        onClick={() => {
          // this.setState({selected: !this.state.selected})
        }}
        class={`item item-${this.props.type}`}
        >
        <header>
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
            class='title item-title'
            >{this.props.item.name}</h3>
          {this.props.headerChildren}
          <button
            class='button'
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
        <div class='item-body'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect()(Item)
