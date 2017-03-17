import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';
import chords from '../data/chords'

import Settings from './Settings.jsx'
import Icon from './Icon.jsx'

import eyeIcon from '../images/eye.svg'

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
    if (this.state.showHUD === true) {
      if (this.props.notes.length > 0) {
        const sortedNotes = [...this.props.notes].sort((a,b) => (a.index - b.index))
        const integerList = sortedNotes.map(note => ((note.index - sortedNotes[0].index) % 12 ))
        // dedupe
        const dedupedList = [...new Set(integerList)]
        matches = chords.filter(el => el.set.length === dedupedList.length && el.set.every((e, i) => e === dedupedList[i]))
        root = sortedNotes[0]
      }
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
                this.props.notes.length > 0
                ? this.props.notes.map(el => (
                  <span class="notes">{el.note}<sub>{el.octave}</sub></span>
                ))
                : <span class="empty">Notes will appear here.</span>
              }</div>
              <div class="viewer chord-viewer">{
                matches.length > 0
                ? matches.map(match => (
                  <span class="chord">
                    <span class="match">{root.note} {match.name} <span class="quality">{match.quality}</span></span>
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
