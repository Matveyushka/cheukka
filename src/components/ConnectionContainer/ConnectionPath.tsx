import * as React from 'react'

interface Point {
  x: number;
  y: number;
}

export interface ConnectionPathProps {
  points: Array<Point>;
  width: number;
  color: string;
  dashed: boolean;
}

export const ConnectionPath = (props: ConnectionPathProps) => {
  const path = props.points.map(point => point.x + ' ' + point.y + ' ').reduce(
    (accumulator, point, index) => accumulator + (index === 0 ? 'M' : 'L') + point, ''
  )

  return (
    <path
      d={path}
      stroke={props.color}
      strokeWidth={props.width}
      strokeDasharray={props.dashed ? '4 4' : '1 0'}
    />
  )
}