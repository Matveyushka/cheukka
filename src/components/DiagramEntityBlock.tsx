import * as React from 'react'
import { Entity, EntityPart } from '../types'
import { getScale } from '../utils'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { EntityContentEditor } from './EntityContentEditor'
import { START_SCALE } from '../constants'
import { setTextSettingsAreOpen, setTextSettings } from '../actions'
import { TextSettings } from '../types/Settings/TextSettings'

export interface DiagramEntityBlockProps {
  parentEntityId: number;
  entityPart: EntityPart
  updateContent: (newContent: string, textSettings: TextSettings) => void;
  scale: number;
}

export const DiagramEntityBlock = (props: DiagramEntityBlockProps) => {
  const dispatch = useDispatch()

  const [
    textSettings,
    defaultTextSettings,
    parentEntity,
    scale
  ] = useSelector((state: Store) => [
    state.textSettings,
    state.defaultTextSettings,
    state.diagramEntities.get(props.parentEntityId),
    getScale(state.scaleLevel)
  ])

  const [isEditingContent, setIsEditingContent] = React.useState<boolean>(false)

  const block = props.entityPart.renderer(parentEntity, props.parentEntityId, scale)

  const contentBlockRef = React.useRef(null);

  const doubleClickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (props.entityPart.contentEditable) {
      setIsEditingContent(true)
      dispatch(setTextSettingsAreOpen(true))
    }
  }

  const finishEditHandler = (newContent: string) => {
    setIsEditingContent(false)
    props.updateContent(newContent, textSettings)
    dispatch(setTextSettings(defaultTextSettings))
    dispatch(setTextSettingsAreOpen(false))
  }

  React.useEffect(() => {
    if (props.entityPart.contentEditable) {
      setIsEditingContent(true)
      dispatch(setTextSettingsAreOpen(true))
    }
  }, [])

  const x = parentEntity.x + block.relativeX
  const y = parentEntity.y + block.relativeY

  const relativeScale = props.scale / getScale(START_SCALE)

  return (
    <g onDoubleClick={doubleClickHandler}>
      {block.svgComponent(x, y, block.width, block.height, props.scale, parentEntity.settings)}
      <foreignObject
        x={x * props.scale}
        y={y * props.scale}
        style={{ overflow: 'visible' }}
      >
        <div
          className='block-content'
          onMouseDown={() => { }}
          ref={contentBlockRef}

          style={{
            minWidth: block.width * getScale(START_SCALE) + 'px',
            left: `${(block.width / 2) * props.scale}px`,
            top: `${(block.height / 2) * props.scale}px`,
            userSelect: 'none',
            transform: `scale(${relativeScale}) translate(-${50 / relativeScale}%, -${50 / relativeScale}%)`
          }}

          dangerouslySetInnerHTML={{
            __html: (!isEditingContent ?
              props.entityPart.content : '')
          }}
        >
        </div>
        {
          isEditingContent ?
            <EntityContentEditor
              x={(block.width / 2) * props.scale}
              y={(block.height / 2) * props.scale}
              width={block.width * getScale(START_SCALE)}
              height={20}
              initContent={props.entityPart.content}
              finishEdit={finishEditHandler}
            />
            : ''
        }
      </foreignObject>
    </g>
  )
}