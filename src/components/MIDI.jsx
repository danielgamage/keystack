import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import reduce from '../reducers'

class Settings extends Component {
	render() {
		return (
      <div class="inputs">
        {this.props.midi.map(el => (
            <div class="viewer">
              <span class="midi-manufacturer">{el.manufacturer}</span>
              <span class="midi-name">{el.name}</span>
            </div>
          ))
        }
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { midi: state.midi }
}

export default connect(mapStateToProps)(Settings)
