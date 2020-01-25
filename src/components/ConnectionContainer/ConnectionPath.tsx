import * as React from 'react'

interface Point {
  x: number,
  y: number,
}

export interface ConnectionPathProps {
  points: Array<Point>
}

export const ConnectionPath = (props: ConnectionPathProps) => {
  const path = props.points.map(point => point.x + ' ' + point.y + ' ').reduce(
    (accumulator, point, index) => accumulator + (index === 0 ? 'M' : 'L') + point, ''
  )

  return (
    <path
      d={path}
      stroke="black"
      strokeWidth={1}
    />
  )
}