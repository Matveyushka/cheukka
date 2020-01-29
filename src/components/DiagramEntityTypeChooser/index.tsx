import * as React from 'react'
import { DiagramEntityType } from '../../types'
import { diagramEntityCreators } from '../../types/DiagramEntityType'
import { useDispatch, useSelector } from 'react-redux'
import { addEntity, setDiagramEntityTypeChooserState, setConnectionTypeChooserState } from '../../actions'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getScale, roundCoordinateOrSize } from '../../utils'
import { Store } from '../../stores'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'

export interface DiagramEntityTypeChooserProps {
  x: number;
  y: number;
  diagramEntityTypes: Array<DiagramEntityType>;
}

export const DiagramEntityTypeChooser = (props: DiagramEntityTypeChooserProps) => {
  const [ scale, diagramEntityTypeChooserState ] = useSelector((state: Store) => [ 
    getScale(state.scaleLevel),
    state.diagramEntityTypeChooserState
  ])
  const dispatch = useDispatch()

  const currentConnectionController = useCurrentDiagramConnectionController()

  const onChoose = (type: DiagramEntityType) => {
    const width = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10)
    const height = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH / 10 * 0.666)
    const x = roundCoordinateOrSize(props.x - width / 2)
    const y = roundCoordinateOrSize(props.y - height / 2)

    dispatch(addEntity(diagramEntityCreators.get(type).create(x, y, width, height)))
    dispatch(setDiagramEntityTypeChooserState({x: 0, y: 0, isActive: false, withConnecting: false }))

    if (diagramEntityTypeChooserState.withConnecting) {
      dispatch(setConnectionTypeChooserState({isActive: true, x, y, endPoint: currentConnectionController.getEnd()}))
    }
  }

  return (
    <div
      className='diagram-entity-type-chooser'
      onMouseDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      style={{
        left: props.x * scale,
        top: props.y * scale,
      }}>
      {
        props.diagramEntityTypes.map((type, index) => (
          <button
            key={index}
            onClick={() => onChoose(type)}
            style={{
              overflow: 'hidden'
            }}
          >
            {diagramEntityCreators.get(type).name}
          </button>))
      }
    </div>
  )

}