import { h, Component } from 'preact'
import { connect } from 'preact-redux'
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
      <div class="status-bar">
        <div class="file-operations">
          <button
            class='button--status'
            onClick={() => {
              saveProject()
            }}
            >
            <Icon
              class='icon'
              src={downloadIcon}
              />
          </button>
          <button
            class='button--status'
            onClick={() => {
              loadProject()
            }}
            >
            <Icon
              class='icon'
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
