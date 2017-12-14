import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import vars from '../../variables.js'

export const StyledH1 = styled.div`
  font-family: 'Source Sans Pro';
  font-weight: 400;
  font-size: 36px;
  letter-spacing: -1.44px;
`

export const StyledH2 = styled.div`
  font-family: 'Source Sans Pro';
  font-weight: 700;
  font-size: 18px;
`

export const StyledH3 = styled.div`
  font-family: 'Source Sans Pro';
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 2px;
  line-height: 14px;
  text-transform: uppercase;
`

export const StyledValue = styled.div`
  font-family: 'Source Code Pro';
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  line-height: 1;
`

export const StyledFlourish = styled.div`
  font-family: 'Source Sans Pro';
  font-weight: 900;
  font-style: italic;
  font-size: 32px;
`

export const StyledText = styled.div`
  font-family: 'Source Sans Pro';
  font-size: 12px;
  line-height: 18px;
`


class Text extends React.Component {
  constructor(props) {
    super(props)

    this.types = [{
      type: 'h1',
      component: StyledH1
    }, {
      type: 'h2',
      component: StyledH2
    }, {
      type: 'h3',
      component: StyledH3
    }, {
      type: 'value',
      component: StyledValue
    }, {
      type: 'flourish',
      component: StyledFlourish
    }, {
      type: 'text',
      component: StyledText
    }]
  }

  render () {
    const current = this.types.find(el => el.type === this.props.type)

    return (
      <current.component {...this.props}>
        {this.props.children}
      </current.component>
    )
  }
}

export default Text

Text.propTypes = {
  type: PropTypes.string,
}

Text.defaultProps = {
  type: 'text',
}
