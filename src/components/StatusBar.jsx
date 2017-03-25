import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { saveProject, loadProject } from '../utils/store'
import Icon from './Icon.jsx'
import downloadIcon from '../images/download.svg'
import uploadIcon from '../images/upload.svg'

class StatusBar extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div>
        <div
          onClick={() => {
            saveProject()
          }}
          >
          <Icon
            class='icon'
            src={downloadIcon}
            />
        </div>
        <div
          onClick={() => {
            loadProject()
          }}
          >
          <Icon
            class='icon'
            src={uploadIcon}
            />
        </div>
      </div>
    )
  }
}

export default connect()(StatusBar)
