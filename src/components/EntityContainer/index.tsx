import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../utils'
import { Store } from '../../stores'
import { Entity, ConnectionAreaPoint, MouseMode, allConnectionTypes, EntityPart, EntityConnectionPoint } from '../../types'
import { removeEntity, updateEntity, setEntitySettings, setEntitySettingsAreOpen } from '../../actions'
import { getBackgroundSvgImage, getSvgExit } from '../../svg'
import { ConnectionAreaContainer } from '../ConnectionAreaContainer'
import { DiagramEntityBlock } from '../DiagramEntityBlock'
import { useEntityContainerHandlers } from './handlers'
import { EntitySizeController } from '../EntitySizeController'
import { 
  validEntityConnectionsBegin, 
  validEntityConnectionsEnd 
} from '../../constants/dictionaries/validEntityConnections'
import { TextSettings } from '../../types/Settings/TextSettings'

export interface EntityContainerProps {
  entityId: number;
  entity: Entity;
  scale: number;
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
    mouseMode,
    currentDiagramConnection,
    diagramEntities,
    scale
  ] = useSelector((state: Store) => [
    state.mouseMode,
    state.currentDiagramConnection,
    state.diagramEntities,
    getScale(state.scaleLevel)
  ])

  React.useEffect(() => {
    if (props.entity.selected) {
      dispatch(setEntitySettings(props.entity.settings))
      dispatch(setEntitySettingsAreOpen(true))
    } else {
      if (Array.from(diagramEntities.values()).filter(entity => entity.selected).length === 0) {
        dispatch(setEntitySettingsAreOpen(false))
      }
    }
  }, [props.entity.selected])

  React.useEffect(() => {
  }, [])

  const dispatch = useDispatch()

  const interfaceControlElementSize = 10 / props.scale
  const connectionAreaWidth = interfaceControlElementSize * 2
  const interfaceColor = props.entity.moved ? 'red' : props.entity.selected ? 'red' : props.entity.isHovered ? 'red' : 'black'

  const isResized = props.entity.sizeChangedOnBottom
    || props.entity.sizeChangedOnLeft
    || props.entity.sizeChangedOnRight
    || props.entity.sizeChangedOnTop

  const realWidth = props.entity.width * props.scale
  const realHeight = props.entity.height * props.scale

  const hoverExtraAreaWidth = Math.max(interfaceControlElementSize, connectionAreaWidth)

  const renderHoverableZone = () => (
    <rect
      x={(props.entity.x - hoverExtraAreaWidth) * props.scale}
      y={(props.entity.y - hoverExtraAreaWidth) * props.scale}
      width={realWidth + hoverExtraAreaWidth * 2 * props.scale}
      height={realHeight + hoverExtraAreaWidth * 2 * props.scale}
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
      height: props.entity.heightToContentAdapter ? props.entity.heightToContentAdapter(props.entityId, scale) : props.entity.height,
      parts: props.entity.parts.map((part, index) =>
        blockIndex === index ?
          new EntityPart(part.renderer, part.contentEditable, newContent) :
          part)
    }))
  }

  const renderBlocks = () => props.entity.parts.map((part, index) => (
    <DiagramEntityBlock
      key={index}
      parentEntityId={props.entityId}
      entityPart={part}
      updateContent={(newContent: string) => changeBlockContent(index, newContent)}
      scale={props.scale}
    />)
  )

  const renderSelection = () => (
    <rect
      className={`block-decoration`}
      x={props.entity.x * props.scale}
      y={props.entity.y * props.scale}
      width={realWidth}
      height={realHeight}
      stroke={interfaceColor}
      strokeWidth={4}
      strokeDasharray='4,4'
      fill={'transparent'}
      pointerEvents='none'
    />)

  const renderDeleteButton = () => (
    <foreignObject
      x={(props.entity.x + props.entity.width - interfaceControlElementSize * 1.5) * props.scale}
      y={(props.entity.y + interfaceControlElementSize * 0.5) * props.scale}
      width={interfaceControlElementSize * props.scale}
      height={interfaceControlElementSize * props.scale}
    >
      {(realWidth >= interfaceControlElementSize * 3 * props.scale && realHeight >= interfaceControlElementSize * 3 * props.scale) ?
        <div
          className={`delete-button ${isResized ? 'invisible' : 'on-hover-visible'}`}
          style={{
            width: interfaceControlElementSize * props.scale,
            height: interfaceControlElementSize * props.scale,
            backgroundImage: getBackgroundSvgImage(getSvgExit(props.scale, interfaceColor)),
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
        id={`entity ${props.entityId}`}
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