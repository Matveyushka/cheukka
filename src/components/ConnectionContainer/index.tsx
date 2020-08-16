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
import { setConnectionSettingsAreOpen, setConnectionSettings } from '../../actions'
import { connectionTypeDashedPaths } from '../../constants/arrays/connectionTypePaths'

export interface ConnectionContainerProps {
  connectionId: number | null;
  connection: Connection;
  scale: number;
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const [entities, connections] = useSelector((state: Store) => [state.diagramEntities, state.diagramConnections])
  const dispatch = useDispatch()

  const beginX = props.connection.begin.getX(props.connection.begin)
  const beginY = props.connection.begin.getY(props.connection.begin)
  const endX = props.connection.end.getX(props.connection.begin)
  const endY = props.connection.end.getY(props.connection.begin)

  props.connection.calculateIntermediatePoints(entities, props.connection)

  const pathPoints = [
    {
      x: roundConnectionCoordinateOrSize(beginX) * props.scale,
      y: roundConnectionCoordinateOrSize(beginY) * props.scale
    },
    ...props.connection.intermediatePoints.map(point => ({
      x: roundConnectionCoordinateOrSize(point.getX()) * props.scale,
      y: roundConnectionCoordinateOrSize(point.getY()) * props.scale
    })),
    {
      x: roundConnectionCoordinateOrSize(endX) * props.scale,
      y: roundConnectionCoordinateOrSize(endY) * props.scale
    }
  ]

  const {
    onMouseEnterHandler,
    onMouseLeaveHandler,
    onMouseDown
  } = useConnectionHandlers(props.connectionId)

  const penultX = props.connection.intermediatePoints.length > 0 ?
    props.connection.intermediatePoints[props.connection.intermediatePoints.length - 1].getX() :
    beginX

  const penultY = props.connection.intermediatePoints.length > 0 ?
    props.connection.intermediatePoints[props.connection.intermediatePoints.length - 1].getY() :
    beginY

  React.useEffect(() => {
    if (props.connection.selected) {
      dispatch(setConnectionSettings(props.connection.settings))
      dispatch(setConnectionSettingsAreOpen(true))
    } else {
      if (Array.from(connections.values()).filter(connection => connection.selected).length === 0) {
        dispatch(setConnectionSettingsAreOpen(false))
      }
    }
  }, [props.connection.selected])

  return (
    <>
      {
        <ConnectionPath
          points={pathPoints}
          width={props.connection.settings.thickness}
          color={props.connection.settings.color}
          dashed={connectionTypeDashedPaths.indexOf(props.connection.type) !== -1 ? true : false} />
      }
      {
        <g transform={`rotate(${getSegmentAngle(
          penultX,
          penultY,
          endX,
          endY)} ${roundConnectionCoordinateOrSize(endX) * props.scale} ${roundConnectionCoordinateOrSize(endY) * props.scale})`}>
          {connectionTypeArrows.get(props.connection.type)(
            roundConnectionCoordinateOrSize(endX),
            roundConnectionCoordinateOrSize(endY),
            props.scale,
            props.connection.settings.color,
            props.connection.settings.arrowSize)}
        </g>
      }
      {
        (props.connection.isHovered || props.connection.selected) &&
        <ConnectionPath points={pathPoints} width={4} color='red' dashed={true} />
      }
      {
        false && props.connection.intermediatePoints.map((point, index) => (
          <circle
            key={index}
            cx={roundConnectionCoordinateOrSize(point.getX()) * props.scale}
            cy={roundConnectionCoordinateOrSize(point.getY()) * props.scale}
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