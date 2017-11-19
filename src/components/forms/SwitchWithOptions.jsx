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
    padding: 0 8px;
  }

  .option {
    margin: 0;
    line-height: 16px;
  }
`

class SwitchWithOptions extends React.Component {
  render () {
    return (
      <Container {...this.props} orientation={this.props.orientation}>
        {this.props.orientation === 'row'
          ? ([
            <Text type='h3' className='option'>
              {this.props.options[0].value}
            </Text>,

            <Switch
              className='switch'
              style={{ flex: '1 1 auto' }}
              onInput={this.props.onInput.bind(this)}
              {...this.props}
            />,

            <Text type='h3' className='option'>
              {this.props.options[1].value}
            </Text>
          ])

          : ([
            <div className='options'>
              {this.props.options.map(el => (
                <Text type='h3' className="option">
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
