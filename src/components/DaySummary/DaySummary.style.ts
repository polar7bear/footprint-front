import styled from "styled-components"

export const DayHeader = styled.h1`
  font-weight: bold;
  width: 60px;
  margin-right: 30px;
`
export const DestinationItem = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;

  & + & {
    margin-left: 8px;
  }

  svg {
    margin: 0 5px;
  }
`

export const DayDestination = styled.div`
  display: flex;
  flex-wrap: wrap;
`
