import React, { Component } from 'react'
import { connect } from 'react-redux'
import { saveProject, loadProject } from '../utils/store'
import MIDI from './MIDI.jsx'
import Help from './Help.jsx'
import Icon from './Icon.jsx'
import downloadIcon from '../images/download.svg'
import uploadIcon from '../images/upload.svg'

class StatusBar extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className="status-bar">
        <div className="file-operations">
          <button
            className='button--status'
            onClick={() => {
              saveProject()
            }}
            >
            <Icon
              className='icon'
              src={downloadIcon}
              />
          </button>
          <button
            className='button--status'
            onClick={() => {
              loadProject()
            }}
            >
            <Icon
              className='icon'
              src={uploadIcon}
              />
          </button>
        </div>
        <MIDI />
        <Help />
      </div>
    )
  }
}

export default connect()(StatusBar)
