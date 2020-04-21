import * as React from 'react'
import { EntityType, EntityConnectionPoint, FreeConnectionPoint, ConnectionAreaPoint, allConnectionTypes } from '../../types'
import { entityCreators } from '../../types/DiagramEntityTypes/EntityType'
import { useDispatch, useSelector } from 'react-redux'
import { addEntity, setConnectionTypeChooserState } from '../../actions'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getScale, roundEntityCoordinateOrSize } from '../../utils'
import { Store } from '../../stores'
import { getSegmentAngle } from '../../utils/geometry'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'
import { useEntityTypeChooserController } from '../../hooks/entityTypeChooserHook'

export interface EntityTypeChooserProps {
  x: number;
  y: number;
}

export const EntityTypeChooser = (props: EntityTypeChooserProps) => {
  const [scale, entityTypeChooserState, entities] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.entityTypeChooserState,
    state.diagramEntities,
  ])
  const dispatch = useDispatch()

  const currentConnectionController = useCurrentDiagramConnectionController()
  const entityTypeChooserController = useEntityTypeChooserController()

  const onChoose = (type: EntityType) => {
    const width = roundEntityCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10)
    const height = roundEntityCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10 * 0.666)
    const x = roundEntityCoordinateOrSize(props.x) - width / 2
    const y = roundEntityCoordinateOrSize(props.y) - height / 2

    if (entityTypeChooserState.withConnecting) {
      const beginPoint = currentConnectionController.getBegin()
      const endPoint = currentConnectionController.getEnd()

      const beginX = beginPoint.getX(endPoint, entities)
      const beginY = beginPoint.getY(endPoint, entities)
      const endX = endPoint.getX(beginPoint, entities)
      const endY = endPoint.getY(beginPoint, entities)

      const yBottomBound = roundEntityCoordinateOrSize((
        beginPoint instanceof ConnectionAreaPoint ||
        beginPoint instanceof EntityConnectionPoint) ?
        entities.get(beginPoint.entityId).y + entities.get(beginPoint.entityId).height :
        beginY)

      const yTopBound = roundEntityCoordinateOrSize((
        beginPoint instanceof ConnectionAreaPoint ||
        beginPoint instanceof EntityConnectionPoint) ?
        entities.get(beginPoint.entityId).y :
        beginY)

      const deltaX = (() => {
        if (endX > beginX && (endY > yTopBound && endY < yBottomBound)) return width / 2
        if (endX < beginX && (endY > yTopBound && endY < yBottomBound)) return -(width / 2)
        return 0
      })()

      const deltaY = (() => {
        if (endY <= yTopBound) return - height / 2
        if (endY >= yBottomBound) return height / 2
        return 0
      })()

      dispatch(addEntity(entityCreators.get(type).create(
        roundEntityCoordinateOrSize(x + deltaX),
        roundEntityCoordinateOrSize(y + deltaY),
        width, height)))

      const newEntityId = Math.max(...entities.keys()) + 1

      entityTypeChooserController.deactivate()
      dispatch(setConnectionTypeChooserState({
        x, y, isActive: true, endPoint:
          new EntityConnectionPoint(newEntityId)
      }))
    } else {
      dispatch(addEntity(entityCreators.get(type).create(
        roundEntityCoordinateOrSize(x),
        roundEntityCoordinateOrSize(y),
        width,
        height
      )))
      entityTypeChooserController.deactivate()
    }
  }

  return (
    <div
      className='diagram-entity-type-chooser'
      onMouseDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      style={{ left: props.x * scale, top: props.y * scale }}>
      {
        entityTypeChooserState.diagramEntityTypes.map((type, index) => (
          <button
            key={index}
            onClick={() => onChoose(type)}
          >
            {entityCreators.get(type).name}
          </button>))
      }
      {
        entityTypeChooserState.withConnecting ?
          <button
            onClick={() => {
              dispatch(setConnectionTypeChooserState({
                x: roundEntityCoordinateOrSize(props.x),
                y: roundEntityCoordinateOrSize(props.y),
                isActive: true,
                endPoint: new FreeConnectionPoint(
                  roundEntityCoordinateOrSize(props.x),
                  roundEntityCoordinateOrSize(props.y))
              }))
              entityTypeChooserController.deactivate()
            }}
          >X</button> : ''
      }
    </div>
  )

}