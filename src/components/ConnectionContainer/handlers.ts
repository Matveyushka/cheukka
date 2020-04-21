import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getCanvasX, getScale, getCanvasY } from '../../utils'
import { getFreePointToConnectionDistance } from '../../utils/geometry'
import { updateConnection } from '../../actions'
import { Connection } from '../../types'

export const useConnectionHandlers = (connectionId: number) => {
  const [scale, connections, entities] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramConnections,
    state.diagramEntities,])

  const dispatch = useDispatch()

  const thisConnection = connections.get(connectionId)

  const onMouseEnterHandler = (event: React.MouseEvent) => {
    const x = getCanvasX(event, scale)
    const y = getCanvasY(event, scale)
    const distances = Array.from(connections.entries()).map(
      (connection) => {
        return ({
          distance: getFreePointToConnectionDistance(x, y, connection[1], entities),
          id: connection[0]
        })
      })

    const theClosest = distances.reduce((acc, value) => (value.distance < acc.distance) ? value : acc)

    distances.forEach(o => {
      if (o.id === theClosest.id) {
        dispatch(updateConnection(o.id, { ...connections.get(o.id), isHovered: true }))
      } else {
        dispatch(updateConnection(o.id, { ...connections.get(o.id), isHovered: false }))
      }
    })
  }

  const onMouseLeaveHandler = (event: React.MouseEvent) => {
    Array.from(connections.entries()).map(connection => dispatch(updateConnection(
      connection[0],
      { ...connection[1], isHovered: false }
    )))
  }

  return {
    onMouseEnterHandler,
    onMouseLeaveHandler
  }
}