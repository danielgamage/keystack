import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  Switch,
} from '@/components'

import vars from '@/variables'

export const Container = styled.div`
  width: 212px;

  .switch {
    margin: 0 8px
  }

  .options {
    display: flex;
    padding: 0 8px;
  }
`

class SwitchWithOptions extends React.Component {
  render () {
    return (
      <Container>
        {this.props.orientation === 'column'
          ? ([
            <div className='option'>
              {this.props.options[0].value}
            </div>,

            <Switch
              className='switch'
              style={{ flex: '1 1 auto' }}
              {...this.props}
            />,

            <div className='option'>
              {this.props.options[1].value}
            </div>
          ])

          : ([
            <div className='options'>
              {this.props.options.map(el => (
                <div className="option">
                  {el.value}
                </div>
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
  }))
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
