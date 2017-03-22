import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class AddButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
  }
	render() {
		return (
      <div
        onClick={() => {
          this.setState({open: !this.state.open})
        }}
        class={`add-item ${(this.state.open === true) ? 'open' : 'closed'}`}
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
              class="add-item-option"
              >{item}</button>
          ))
          : <button class="add-item-toggle">+</button>
        }
      </div>
		);
	}
}

export default connect()(AddButton)
