import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';
import chords from '../data/chords'

import Settings from './Settings.jsx'
import Icon from './Icon.jsx'
import removeDuplicates from '../utils/removeDuplicates'

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
    if (this.state.showHUD === true && this.props.notes.length > 0) {
      [...this.props.notes].map((loopEl, loopIndex, arr) => {
        const integerList = arr.map((note) => {
          return (note.index - arr[loopIndex].index + 96) % 12
        })
        const dedupedList = [...new Set(integerList)]
        chords.filter(el => (
          el.set.length === dedupedList.length
          && el.set.every((e) => dedupedList.indexOf(e) !== -1 )
        )).map(chord => {
          matches.push({
            chord: `${arr[loopIndex].note} ${chord.name}`,
            quality: chord.quality
          })
        })
      })
      // dedupe results
      matches = removeDuplicates(matches, 'chord')
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
