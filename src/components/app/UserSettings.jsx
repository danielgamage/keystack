import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import vars from "variables"

import { Icon, Text, ThemeSettings, Kbd, Popover } from "components"

import gearIcon from "images/icon/gear.svg"

const StyledUserSettings = styled.div`
  position: relative;
  display: flex;
  padding-right: 8px;

  .settings-container {
    padding: 2rem;
    max-width: 16rem;
    max-height: calc(100vh - 8rem);
    z-index: 10;
    section {
      margin-right: 2rem;
    }
    .flex-container {
      margin: 2rem 0;
    }

    .row {
      display: flex;
      justify-content: center;
      kbd {
        margin: 0.1rem;
        &[disabled] {
          opacity: 0.2;
        }
      }
      &.black {
        kbd {
          border-color: var(--grey-0);
        }
      }
      &.white {
        kbd {
          color: var(--grey-0);
          background: var(--grey-6);
          border-color: var(--grey-4);
        }
      }
    }
  }
`

class UserSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }

    this.togglePopover = this.togglePopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
  }

  togglePopover() {
    this.setState({ active: !this.state.isOpen })
  }

  closePopover() {
    this.setState({
      isOpen: false,
    })
  }

  render() {
    return (
      <StyledUserSettings>
        <button
          className="button"
          title={`${this.state.isOpen ? "Close" : "Open"} UserSettings Panel`}
          onClick={(e) => {
            this.setState({ isOpen: !this.state.isOpen })
          }}
        >
          <Icon className={`icon icon--help`} src={gearIcon} scale={1} />
        </button>

        <Popover
          isOpen={this.state.isOpen}
          onClickOutside={this.closePopover}
          place="below"
        >
          <div className="settings-container">
            <h3 className="h3">Settings</h3>

            <ThemeSettings
              prefs={this.props.theme}
              onInput={(event) => {
                this.props.dispatch({
                  type: "UPDATE_THEME",
                  value: event,
                })
              }}
            />
          </div>
        </Popover>
      </StyledUserSettings>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(UserSettings)
