import React from 'react'
import styled from 'styled-components'

import vars from '../../variables.js'
console.log('hi1')

export const StyledH1 = styled.h1`
  font-family: 'Source Sans Pro';
  font-weight: 400;
  font-size: 36px;
  color: #7C7C7F;
  letter-spacing: -1.44px;
`

export const StyledH2 = styled.h2`
  font-family: 'Source Sans Pro';
  font-weight: 700;
  font-size: 18px;
  color: #5A5A5F;
  letter-spacing: -0.72px;
`

export const StyledH3 = styled.h3`
  font-family: 'Source Sans Pro';
  font-weight: 700;
  font-size: 10px;
  color: #7C7C7F;
  letter-spacing: 2px;
  line-height: 14px;
  text-transform: uppercase;
`

export const StyledValue = styled.span`
  font-family: SourceCodePro-Medium;
  font-size: 10px;
  color: #444649;
`

export const StyledFlourish = styled.span`
  font-family: 'Source Sans Pro';
  font-weight: 900;
  font-style: italic;
  font-size: 32px;
  color: #7C7C7C;
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
