import React, { Component } from "react"
import { connect } from "react-redux"
import { saveProject, loadProject } from "utils/store"
import { Midi, Help, UserSettings, Icon } from "components"

import downloadIcon from "images/icon/download.svg"
import uploadIcon from "images/icon/upload.svg"

import styled from "styled-components"
import vars from "variables"

const StyledStatusBar = styled.div`
  height: 2rem;
  display: flex;
  gap: 2px;
  background: var(--bg-recessed);
  border-radius: var(--radius);
  padding: 2px;
  border: 1px solid var(--bg-deep);

  .section-icon {
    display: flex;
    align-items: center;
  }
  .file-operations {
    display: flex;
    width: calc(50% + 1rem);
    gap: 2px;
  }
  .button {
    ${vars.mixins.button_reset}

    color: inherit;
    padding: 0 0.5rem;
    background: var(--bg);
    border-radius: var(--radius);
  }
  .inputs {
    display: flex;
    width: calc(50% - 3rem);
    align-items: center;
    gap: 0.5rem;
  }
`

class StatusBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <StyledStatusBar>
        <Midi />

        <Help />

        <UserSettings />
      </StyledStatusBar>
    )
  }
}

export default connect()(StatusBar)
