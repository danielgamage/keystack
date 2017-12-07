import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import vars from '@/variables'

import {
  Icon,
  Text,
  ThemeSettings,
  Kbd,
  Popover
} from '@/components'

import helpIcon from '@/images/icon/help.svg'

const keyboardRows = [
  {
    color: 'black',
    keys: [
      { key: `Q`, disabled: true },
      { key: `W`, disabled: false },
      { key: `E`, disabled: false },
      { key: `R`, disabled: true },
      { key: `T`, disabled: false },
      { key: `Y`, disabled: false },
      { key: `U`, disabled: false },
      { key: `I`, disabled: true },
      { key: `O`, disabled: false },
      { key: `P`, disabled: false },
      { key: `[`, disabled: true },
      { key: `]`, disabled: false }
    ]
  },
  {
    color: 'white',
    keys: [
      { key: `A`, disabled: false },
      { key: `S`, disabled: false },
      { key: `D`, disabled: false },
      { key: `F`, disabled: false },
      { key: `G`, disabled: false },
      { key: `H`, disabled: false },
      { key: `J`, disabled: false },
      { key: `K`, disabled: false },
      { key: `L`, disabled: false },
      { key: `;`, disabled: false },
      { key: `'`, disabled: false }
    ]
  }
]

const StyledHelp = styled.div`
  position: relative;
  display: flex;

  .help-container {
    background: ${vars.white};
    border-radius: ${vars.radius};
    box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
    padding: 2rem;
    width: calc(100vw - 8rem);
    max-width: 32rem;
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
          border-color: ${vars.grey_0};
        }
      }
      &.white {
        kbd {
          color: ${vars.grey_0};
          background: ${vars.grey_6};
          border-color: ${vars.grey_4};
        }
      }
    }
  }
`

class Help extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
    }

    this.togglePopover = this.togglePopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
  }

  togglePopover () {
    this.setState({ isOpen: !this.state.isOpen })
  }

  closePopover () {
    this.setState({
      isOpen: false
    })
  }

  render () {
    return (
      <StyledHelp>
        <button
          className='button'
          title={`${this.state.isOpen ? 'Close' : 'Open'} Help Panel`}
          onClick={(e) => {
            this.setState({ isOpen: !this.state.isOpen })
          }}
        >
          <Icon
            className={`icon icon--help`}
            src={helpIcon}
            scale={2}
          />
        </button>

        <Popover
          isOpen={this.state.isOpen}
          onClickOutside={this.closePopover}
          place='below'
        >
          <div className="help-container">
            <Text type='h3'>Help</Text>
            <div className='flex-container'>
              <section>
                <Text type='h2'>octave</Text>
                <Kbd title='z shifts octave down'>z</Kbd>/<Kbd title='x shifts octave up'>x</Kbd>
              </section>
              <section>
                <Text type='h2'>notes</Text>
                <div className='keyboard'>
                  {keyboardRows.map(row => (
                    <div key={row.color} className={`row ${row.color}`}>
                      {row.keys.map(key => (
                        <Kbd key={key.key} disabled={key.disabled}>{key.key}</Kbd>
                        ))}
                    </div>
                    ))}
                </div>
              </section>
            </div>

            <div>
              <a className='button' href='https://github.com/danielgamage/keystack'>Keystack on GitHub</a>
            </div>
          </div>
        </Popover>
      </StyledHelp>
    )
  }
}


function mapStateToProps (state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(Help)
