import React, { Component } from 'react'
import { connect } from 'react-redux'
import { saveProject, loadProject } from '@/utils/store'
import {
  Midi,
  Help,
  UserSettings,
  Icon,
} from '@/components'

import downloadIcon from '@/images/icon/download.svg'
import uploadIcon from '@/images/icon/upload.svg'

import styled from 'styled-components'
import vars from '@/variables'

const StyledStatusBar = styled.div`
  height: 2rem;
  display: flex;
  background-color: ${props => props.theme.lightness === 'light'
    ? vars.grey_6
    : vars.grey_1
  };
  color: ${props => props.theme.lightness === 'light'
    ? vars.grey_3
    : vars.grey_5
  };

  border-radius: ${vars.radius};
  .file-operations {
    padding-left: 8px;
    display: flex;
    width: calc(50% + 1rem);
  }
  .button {
    color: inherit;
    & + .button {
      margin-left: 8px
    }

    ${vars.mixins.button_reset}
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
            className='button'
            onClick={() => {
              saveProject()
            }}
            >
            <Icon
              className='icon'
              src={downloadIcon}
              scale={2}
            />
          </button>
          <button
            className='button'
            onClick={() => {
              loadProject()
            }}
            >
            <Icon
              className='icon'
              src={uploadIcon}
              scale={2}
            />
          </button>
        </div>

        <Midi />

        <Help />

        <UserSettings />
      </StyledStatusBar>
    )
  }
}

export default connect()(StatusBar)
