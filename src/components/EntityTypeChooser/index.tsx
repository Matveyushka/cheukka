import * as React from 'react'
import { EntityType, EntityConnectionPoint, FreeConnectionPoint, ConnectionAreaPoint, allConnectionTypes } from '../../types'
import { entityCreators } from '../../types/DiagramEntityTypes/EntityType'
import { useDispatch, useSelector } from 'react-redux'
import { addEntity, setConnectionTypeChooserState } from '../../actions'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getScale, roundCoordinateOrSize } from '../../utils'
import { Store } from '../../stores'
import { getSegmentAngle, getPointX, getPointY } from '../../utils/geometry'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'
import { useEntityTypeChooserController } from '../../hooks/entityTypeChooserHook'

export interface EntityTypeChooserProps {
  x: number;
  y: number;
}

export const EntityTypeChooser = (props: EntityTypeChooserProps) => {
  const [scale, entityTypeChooserState, entities ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.entityTypeChooserState,
    state.diagramEntities,
  ])
  const dispatch = useDispatch()

  const currentConnectionController = useCurrentDiagramConnectionController()
  const entityTypeChooserController = useEntityTypeChooserController()

  const onChoose = (type: EntityType) => {
    const width = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10)
    const height = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10 * 0.666)
    const x = props.x - width / 2
    const y = props.y - height / 2

    if (entityTypeChooserState.withConnecting) {
      const beginPoint = currentConnectionController.getBegin()
      const endPoint = currentConnectionController.getEnd()

      const inputAngle = getSegmentAngle(
        getPointX(beginPoint, beginPoint, entities),
        getPointY(beginPoint, beginPoint, entities),
        getPointX(endPoint, beginPoint, entities),
        getPointY(endPoint, beginPoint, entities),
      )

      const offsettedAngle = (inputAngle + 45) % 360

      const deltaX = (() => {
        if (offsettedAngle <= 90 || (offsettedAngle > 180 && offsettedAngle <= 270)) return 0
        if (offsettedAngle > 90 && offsettedAngle <= 180) return width / 2
        if (offsettedAngle > 270) return - width / 2
      })()

      const deltaY = (() => {
        if (offsettedAngle > 270 || (offsettedAngle > 90 && offsettedAngle <= 180)) return 0
        if (offsettedAngle > 180 && offsettedAngle <= 270) return height / 2
        if (offsettedAngle <= 90) return - height / 2
      })()

      dispatch(addEntity(entityCreators.get(type).create(
        roundCoordinateOrSize(x + deltaX),
        roundCoordinateOrSize(y + deltaY),
        width, height)))

      const newEntityId = Math.max(...entities.keys()) + 1

      entityTypeChooserController.deactivate()
      dispatch(setConnectionTypeChooserState({
        x, y, isActive: true, endPoint:
          new EntityConnectionPoint(newEntityId)
      }))
    } else {
      dispatch(addEntity(entityCreators.get(type).create(
        roundCoordinateOrSize(x),
        roundCoordinateOrSize(y),
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
                x: roundCoordinateOrSize(props.x),
                y: roundCoordinateOrSize(props.y),
                isActive: true,
                endPoint: new FreeConnectionPoint(
                  roundCoordinateOrSize(props.x),
                  roundCoordinateOrSize(props.y))
              }))
              entityTypeChooserController.deactivate()
            }}
          >X</button> : ''
      }
    </div>
  )

}