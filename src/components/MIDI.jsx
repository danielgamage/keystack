import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Icon from './Icon.jsx'

import midiIcon from '../images/midi.svg'

class Settings extends Component {
	render() {
    const hasMidi = this.props.midi.length > 0
		return (
      <div class="inputs info-section">
        <div class="section-icon">
          <Icon
            class={`icon icon--midi ${hasMidi && 'on'}`}
            src={midiIcon}
            />
        </div>
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
