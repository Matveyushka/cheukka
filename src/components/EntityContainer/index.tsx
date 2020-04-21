import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../utils'
import { Store } from '../../stores'
import { Entity, ConnectionAreaPoint, MouseMode, allConnectionTypes, EntityPart, EntityConnectionPoint } from '../../types'
import { removeEntity, updateEntity } from '../../actions'
import { getBackgroundSvgImage, getSvgExit } from '../../svg'
import { ConnectionAreaContainer } from '../ConnectionAreaContainer'
import { DiagramEntityBlock } from '../DiagramEntityBlock'
import { useEntityContainerHandlers } from './handlers'
import { EntitySizeController } from '../EntitySizeController'
import { 
  validEntityConnectionsBegin, 
  validEntityConnectionsEnd 
} from '../../constants/dictionaries/validEntityConnections'

export interface EntityContainerProps {
  entityId: number,
  entity: Entity,
}

export const EntityContainer = (props: EntityContainerProps) => {
  const {
    onMouseDownHandler,
    onMouseEnterHandler,
    onMouseLeaveHandler,
    onMouseMoveHandler,
    onMouseUpHandler,
    isConnectable,
  } = useEntityContainerHandlers(props.entityId)

  const [
    scale,
    mouseMode,
    currentDiagramConnection,
    diagramEntities
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.mouseMode,
    state.currentDiagramConnection,
    state.diagramEntities
  ])

  const dispatch = useDispatch()

  const interfaceControlElementSize = 10 / scale
  const connectionAreaWidth = interfaceControlElementSize * 2
  const interfaceColor = props.entity.moved ? 'red' : props.entity.selected ? 'red' : props.entity.isHovered ? 'red' : 'black'

  const isResized = props.entity.sizeChangedOnBottom
    || props.entity.sizeChangedOnLeft
    || props.entity.sizeChangedOnRight
    || props.entity.sizeChangedOnTop

  const realWidth = props.entity.width * scale
  const realHeight = props.entity.height * scale

  const hoverExtraAreaWidth = Math.max(interfaceControlElementSize, connectionAreaWidth)

  const renderHoverableZone = () => (
    <rect
      x={(props.entity.x - hoverExtraAreaWidth) * scale}
      y={(props.entity.y - hoverExtraAreaWidth) * scale}
      width={realWidth + hoverExtraAreaWidth * 2 * scale}
      height={realHeight + hoverExtraAreaWidth * 2 * scale}
      fill='transparent'
    />)

  const renderConnectionAreas = () => props.entity.connectionAreaCreators
    .map((_, index) =>
      <ConnectionAreaContainer
        key={index}
        width={connectionAreaWidth}
        entityId={props.entityId}
        areaId={index} />)

  const changeBlockContent = (blockIndex: number, newContent: string) => {
    dispatch(updateEntity(props.entityId, {
      ...props.entity,
      parts: props.entity.parts.map((part, index) =>
        blockIndex === index ?
          new EntityPart(part.renderer, part.contentEditable, newContent) :
          part)
    }))
  }

  const renderBlocks = () => props.entity.parts.map((part, index) => (
    <DiagramEntityBlock
      key={index}
      parentEntity={props.entity}
      entityPart={part}
      updateContent={(newContent: string) => changeBlockContent(index, newContent)}
    />)
  )

  const renderSelection = () => (
    <rect
      className={`block-decoration`}
      x={props.entity.x * scale}
      y={props.entity.y * scale}
      width={realWidth}
      height={realHeight}
      stroke={interfaceColor}
      strokeWidth={4}
      strokeDasharray="4,4"
      fill={'transparent'}
      pointerEvents='none'
    />)

  const renderDeleteButton = () => (
    <foreignObject
      x={(props.entity.x + props.entity.width - interfaceControlElementSize * 1.5) * scale}
      y={(props.entity.y + interfaceControlElementSize * 0.5) * scale}
      width={interfaceControlElementSize * scale}
      height={interfaceControlElementSize * scale}
    >
      {(realWidth >= interfaceControlElementSize * 3 * scale && realHeight >= interfaceControlElementSize * 3 * scale) ?
        <div
          className={`delete-button ${isResized ? 'invisible' : 'on-hover-visible'}`}
          style={{
            width: interfaceControlElementSize * scale,
            height: interfaceControlElementSize * scale,
            backgroundImage: getBackgroundSvgImage(getSvgExit(scale, interfaceColor)),
          }}
          onMouseDown={(event) => { event.stopPropagation() }}
          onClick={() => { dispatch(removeEntity(props.entityId)) }}
        /> : ''
      }
    </foreignObject>)

  const shouldRenderConnectionAreas = props.entity.isHovered &&
    !(mouseMode === MouseMode.dragging)
    && (mouseMode !== MouseMode.connecting || isConnectable())

  const shouldRenderContainerInterface = (props.entity.selected ||
    props.entity.isHovered) && mouseMode === MouseMode.default

  const shouldRenderSizeControllers = props.entity.isHovered && mouseMode === MouseMode.default

  return (
    <g className='block'
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
      onMouseOver={onMouseEnterHandler}>
      {renderHoverableZone()}
      {shouldRenderConnectionAreas && renderConnectionAreas()}
      <g
        onMouseDown={onMouseDownHandler}
        onMouseUp={onMouseUpHandler}
        onMouseMove={onMouseMoveHandler}
      > {renderBlocks()} </g>
      {
        shouldRenderContainerInterface &&
        <>
          {renderSelection()}
          {renderDeleteButton()}
        </>
      }
      {
        shouldRenderSizeControllers &&
        <EntitySizeController
          entity={props.entity}
          entityId={props.entityId}
        />
      }
    </g>
  )
}