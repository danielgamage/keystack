import React, { Component } from "react"
import { Button, Icon } from "components"
import xIcon from "images/icon/x.svg"

import styled from "styled-components"
import vars from "variables"

const StyledButton = styled(Button)`
  position: relative;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  border-radius: 4rem;
  .icon--x {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    fill: var(--grey-5);
  }
  &:hover,
  &:focus {
    background-color: ${vars.accents.red.dark};
    .icon--x {
      fill: ${vars.white};
    }
  }
`

class Item extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <StyledButton {...this.props}>
        <Icon className="icon--x" src={xIcon} scale={1.5} />
      </StyledButton>
    )
  }
}

export default Item
