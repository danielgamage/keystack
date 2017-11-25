import React, { Component } from 'react'
import { connect } from 'react-redux'
import { saveProject, loadProject } from '@/utils/store'
import {
  Midi,
  Help,
  Icon,
} from '@/components'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'

import styled from 'styled-components'
import vars from '@/variables'

const StyledStatusBar = styled.div`
  height: 2rem;
  display: flex;
  background-color: ${vars.grey_6};
  border-radius: ${vars.radius};
  .file-operations {
    display: flex;
    width: calc(50% + 1rem);
  }
  .inputs {
    display: flex;
    width: calc(50% - 3rem);
    align-items: center;
  }
`

class StatusBar extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <StyledStatusBar>
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
        <Midi />
        <Help />
      </StyledStatusBar>
    )
  }
}

export default connect()(StatusBar)
