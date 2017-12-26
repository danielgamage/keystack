import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Switch,
  Text,
} from '@/components'

import vars from '@/variables'

export const Container = styled.div`
  width: 212px;
  display: ${props => props.orientation === 'row'
    ? 'flex'
    : 'block'
  };

  .switch {
    margin: 0 8px
  }

  .options {
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
  }

  .option {
    margin: 0;
    line-height: 16px;
    cursor: pointer;
    user-select: none;
  }
`

class SwitchWithOptions extends React.Component {
  constructor (props) {
    super(props)
    this.updateValue = this.updateValue.bind(this)
  }

  updateValue (value) {
    this.props.onInput(value)
  }

  render () {
    return (
      <Container {...this.props} orientation={this.props.orientation}>
        {this.props.orientation === 'row'
          ? ([
            <Text
              type='h3'
              className='option'
              onClick={() => this.updateValue(this.props.options[0].value)}
            >
              {this.props.options[0].value}
            </Text>,

            <Switch
              className='switch'
              style={{ flex: '1 1 auto' }}
              onInput={this.props.onInput.bind(this)}
              {...this.props}
            />,

            <Text
              type='h3'
              className='option'
              onClick={() => this.updateValue(this.props.options[1].value)}
            >
              {this.props.options[1].value}
            </Text>
          ])

          : ([
            <div className='options'>
              {this.props.options.map(el => (
                <Text
                  key={el.value}
                  type='h3'
                  className='option'
                  onClick={() => this.updateValue(el.value)}
                >
                  {el.value}
                </Text>
              ))}
            </div>,

            <Switch
              className='switch'
              style={{ flex: '1 1 auto' }}
              {...this.props}
            />
          ])
        }
      </Container>
    )
  }
}

SwitchWithOptions.propTypes = {
  value: PropTypes.any.isRequired,
  orientation: PropTypes.oneOf(['column', 'row']),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    dark: PropTypes.bool,
  })),
  onInput: PropTypes.func,
}

SwitchWithOptions.defaultProps = {
  options: [{
    value: false,
    strong: false,
  }, {
    value: true,
    strong: true,
  }],
}

export default SwitchWithOptions
