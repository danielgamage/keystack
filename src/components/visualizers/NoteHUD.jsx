import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Settings from '../Settings.jsx'
import Icon from '../Icon.jsx'
import matchChords from '../../utils/matchChords'
import eyeIcon from '../../images/eye.svg'

class NoteHUD extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showHUD: true
    }
  }
  switchTabs (tab) {
    this.setState({tab: tab})
  }
	render() {
    let matches = []
    let root
    if (this.state.showHUD === true && this.props.notes[this.props.midiReadPosition].length > 0) {
      matches = matchChords([...this.props.notes[this.props.midiReadPosition]])
    }
		return (
      <div class="note-hud info-section">
        <div class="section-icon">
          <Icon
            class={`icon icon--eye ${this.state.showHUD && 'on'}`}
            onClick={() => {
              this.setState({showHUD: !this.state.showHUD})
            }}
            src={eyeIcon}
            />
        </div>
        {(this.state.showHUD === true) &&
          <div>
            <div>
              <div class="viewer note-viewer">{
                this.props.notes[this.props.midiReadPosition].length > 0
                ? this.props.notes[this.props.midiReadPosition].map(el => (
                  <span class="notes">{el.note}<sub>{el.octave}</sub></span>
                ))
                : <span class="empty">Notes will appear here.</span>
              }</div>
              <div class="viewer chord-viewer">{
                matches.length > 0
                ? matches.map(match => (
                  <span class="chord">
                    <span class="match">{match.chord} <span class="quality">{match.quality}</span></span>
                  </span>
                ))
                : <span class="empty">Matched chords will appear here.</span>
              }</div>
            </div>
          </div>
        }
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(NoteHUD)
