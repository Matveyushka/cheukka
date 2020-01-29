import * as React from 'react'
import {
  Connection,
} from '../../types'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale } from '../../utils'
import { ConnectionPath } from './ConnectionPath'
import { ConnectionTypeArrows } from '../../constants/dictionaries'
import { updateConnection } from '../../actions'
import { getPointX, getPointY, getSegmentAngle } from './utils'
import { useConnectionHandlers } from './handlers'

export interface ConnectionContainerProps {
  connectionId: number | null,
  connection: Connection,
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const [scale, entities] = useSelector((state: Store) => [getScale(state.scaleLevel), state.diagramEntities])
  const dispatch = useDispatch()

  const beginX = getPointX(props.connection.begin, props.connection.begin, entities)
  const beginY = getPointY(props.connection.begin, props.connection.begin, entities)
  const endX = getPointX(props.connection.end, props.connection.begin, entities)
  const endY = getPointY(props.connection.end, props.connection.begin, entities)

  const pathPoints = [
    { x: beginX * scale, y: beginY * scale },
    { x: endX * scale, y: endY * scale }
  ]

  const {
    onMouseEnterHandler,
    onMouseLeaveHandler
  } = useConnectionHandlers(props.connectionId)

  return (
    <>
      <ConnectionPath
        points={pathPoints}
        width={1}
        color='black'
        dashed={false}
      />
      {
        <g transform={`rotate(${getSegmentAngle(
          beginX,
          beginY,
          endX,
          endY)} ${endX * scale} ${endY * scale})`}>
          {ConnectionTypeArrows.get(props.connection.type)(endX, endY, scale)}
        </g>
      }
      {
        props.connection.isHovered ?
          <ConnectionPath
            points={pathPoints}
            width={4}
            color='red'
            dashed={true}
          />
          : ''
      }
      <g
        onMouseEnter={onMouseEnterHandler}
        onMouseMove={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <ConnectionPath
          points={pathPoints}
          width={25}
          color='transparent'
          dashed={false}
        />
      </g>
    </>
  )
}