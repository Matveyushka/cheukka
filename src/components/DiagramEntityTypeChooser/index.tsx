import * as React from 'react'
import { DiagramEntityType } from '../../types'
import { diagramEntityCreators } from '../../types/DiagramEntityType'
import { useDispatch, useSelector } from 'react-redux'
import { addEntity, setDiagramEntityTypeChooserState } from '../../actions'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getScale, roundCoordinateOrSize } from '../../utils'
import { Store } from '../../stores'

export interface DiagramEntityTypeChooserProps {
  x: number;
  y: number;
  diagramEntityTypes: Array<DiagramEntityType>;
}

export const DiagramEntityTypeChooser = (props: DiagramEntityTypeChooserProps) => {
  const scale = useSelector((state: Store) => getScale(state.scale))
  const dispatch = useDispatch()

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
            onClick={() => {
              const width = DEFAULT_CANVAS_WIDTH / 10
              const height = DEFAULT_CANVAS_WIDTH / 10 * 0.666
              const x = roundCoordinateOrSize(props.x - width / 2)
              const y = roundCoordinateOrSize(props.y - height / 2)

              dispatch(addEntity(diagramEntityCreators.get(type).create(x, y, width, height)))
              dispatch(setDiagramEntityTypeChooserState({
                x: 0,
                y: 0,
                isActive: false,
              }))
            }}
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