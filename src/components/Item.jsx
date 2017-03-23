import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class Item extends Component {
  constructor (props) {
    super(props)
  }
	render() {
		return (
      <div
        onClick={() => {
          // this.setState({selected: !this.state.selected})
        }}
        class={`item item-${this.props.type}`}
        >
        <header>
          <h3 class="title">{this.props.title}</h3>
          {this.props.headerChildren}
          <button
            class="button"
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
        <div class="item-body">
          {this.props.children}
        </div>
      </div>
		);
	}
}

export default connect()(Item)
