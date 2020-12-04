import React, { Component } from "react"
import { connect } from "react-redux"

import styled from "styled-components"
import vars from "variables"

import { Icon } from "components"

import matchChords from "utils/matchChords"
import eyeIcon from "images/icon/eye.svg"

const StyledNoteHUD = styled.div`
  display: flex;
  margin-bottom: 1rem;

  .section-icon {
    margin-right: 0.5rem;
  }
  .icon--eye {
    transform: translateY(-0.5rem);
    flex: 0;
    cursor: pointer;

    circle,
    path {
      fill: none;
      stroke: var(--fg-1);
    }
    .pupil {
      transition: 0.5s ease;
    }
    &.on {
      .pupil {
        fill: var(--fg-3);
      }
    }
  }
  .viewer {
    margin-bottom: 0.5rem;
  }
  .note-viewer {
    font-weight: 700;
  }
  .chord-viewer {
    line-height: 1.5;
  }
  .empty {
    color: var(--fg-3);
  }
  .notes {
    display: inline-block;
    margin-right: 0.25rem;
  }
  .chord {
    margin-right: 1rem;
    .root {
      font-weight: 700;
      margin-right: 0.2em;
    }
  }
  sub {
    position: static;
    font-size: 1rem;
    vertical-align: baseline;
  }
`

class NoteHUD extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showHUD: true,
    }
  }
  switchTabs(tab) {
    this.setState({ tab: tab })
  }
  render() {
    let matches = []
    if (
      this.state.showHUD === true &&
      this.props.notes[this.props.midiReadPosition].length > 0
    ) {
      matches = matchChords([...this.props.notes[this.props.midiReadPosition]])
    }
    return (
      <StyledNoteHUD>
        <div className="section-icon">
          <Icon
            className={`icon icon--eye ${this.state.showHUD && "on"}`}
            onClick={() => {
              this.setState({ showHUD: !this.state.showHUD })
            }}
            src={eyeIcon}
          />
        </div>
        {this.state.showHUD === true && (
          <div>
            <div>
              <div className="viewer note-viewer">
                {this.props.notes[this.props.midiReadPosition].length > 0 ? (
                  this.props.notes[this.props.midiReadPosition].map((el) => (
                    <span key={el.note + el.octave} className="notes">
                      {el.note}
                      <sub>{el.octave}</sub>
                    </span>
                  ))
                ) : (
                  <span className="empty">Notes will appear here.</span>
                )}
              </div>
              <div className="viewer chord-viewer">
                {matches.length > 0 ? (
                  matches.map((match, i, arr) => (
                    <span key={match.name} className="chord">
                      <span className="root">{match.root}</span>
                      <span className="name">{match.name}</span>
                    </span>
                  ))
                ) : (
                  <span className="empty">
                    Matched chords will appear here.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </StyledNoteHUD>
    )
  }
}

function mapStateToProps(state) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(NoteHUD)
