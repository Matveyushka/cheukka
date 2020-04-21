import * as React from 'react'
import {
  Connection,
} from '../../types'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, roundConnectionCoordinateOrSize } from '../../utils'
import { ConnectionPath } from './ConnectionPath'
import { connectionTypeArrows } from '../../constants/dictionaries/connectionTypeArrows'
import { getSegmentAngle } from '../../utils/geometry'
import { useConnectionHandlers } from './handlers'

export interface ConnectionContainerProps {
  connectionId: number | null;
  connection: Connection;
  scale: number;
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const [entities] = useSelector((state: Store) => [state.diagramEntities])
  const dispatch = useDispatch()

  const beginX = props.connection.begin.getX(props.connection.begin, entities)
  const beginY = props.connection.begin.getY(props.connection.begin, entities)
  const endX = props.connection.end.getX(props.connection.begin, entities)
  const endY = props.connection.end.getY(props.connection.begin, entities)

  props.connection.calculateIntermediatePoints(entities, props.connection)

  const pathPoints = [
    { x: roundConnectionCoordinateOrSize(beginX) * props.scale, 
      y: roundConnectionCoordinateOrSize(beginY) * props.scale },
    ...props.connection.intermediatePoints.map(point => ({
      x: roundConnectionCoordinateOrSize(point.getX(props.connection.begin, entities)) * props.scale,
      y: roundConnectionCoordinateOrSize(point.getY(props.connection.begin, entities)) * props.scale
    })),
    { x: roundConnectionCoordinateOrSize(endX) * props.scale, 
      y: roundConnectionCoordinateOrSize(endY) * props.scale }
  ]

  const {
    onMouseEnterHandler,
    onMouseLeaveHandler,
    onMouseDown
  } = useConnectionHandlers(props.connectionId)

  const penultX = props.connection.intermediatePoints.length > 0 ?
    props.connection.intermediatePoints[props.connection.intermediatePoints.length - 1].getX(props.connection.begin, entities) :
    beginX

  const penultY = props.connection.intermediatePoints.length > 0 ?
    props.connection.intermediatePoints[props.connection.intermediatePoints.length - 1].getY(props.connection.begin, entities) :
    beginY

  return (
    <>
      {
        true && <ConnectionPath points={pathPoints} width={1} color='black' dashed={false} />
      }
      {
        <g transform={`rotate(${getSegmentAngle(
          penultX,
          penultY,
          endX,
          endY)} ${roundConnectionCoordinateOrSize(endX) * props.scale} ${roundConnectionCoordinateOrSize(endY) * props.scale})`}>
          {connectionTypeArrows.get(props.connection.type)(
            roundConnectionCoordinateOrSize(endX), roundConnectionCoordinateOrSize(endY), props.scale)}
        </g>
      }
      {
        props.connection.isHovered &&
        <ConnectionPath points={pathPoints} width={4} color='red' dashed={true} />
      }
      {
        true && props.connection.intermediatePoints.map((point, index) => (
          <circle
            key={index}
            cx={roundConnectionCoordinateOrSize(point.getX(null, entities)) * props.scale}
            cy={roundConnectionCoordinateOrSize(point.getY(null, entities)) * props.scale}
            r={2}
            fill='black'
          />
        ))
      }
      <g
        onMouseEnter={onMouseEnterHandler}
        onMouseMove={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
        onMouseDown={onMouseDown}
      >
        <ConnectionPath points={pathPoints} width={25} color='transparent' dashed={false} />
      </g>
    </>
  )
}