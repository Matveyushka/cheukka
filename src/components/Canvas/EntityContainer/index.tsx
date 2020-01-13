import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../../utils'
import { Store } from '../../../stores'
import { Entity } from '../../../types'
import { removeEntity, updateEntity } from '../../../actions'
import { getBackgroundSvgImage, getSvgExit } from '../../../svg' 
import { SizeController, SizeControlType } from './SizeController'

export interface EntityContainerProps {
  entityId: number,
  entity: Entity,
}

export const EntityContainer = (props: EntityContainerProps) => {
  const [ isHovered, setIsHovered ] = React.useState<boolean>(false)
  
  const scale = useSelector((state: Store) => getScale(state.scale))
  const dispatch = useDispatch()

  const interfaceControlElementSize = 10 / scale
  const interfaceColor = props.entity.moved ? 'orange' : props.entity.selected ? 'orange' : isHovered ? 'red' : 'black'

  const isResized = props.entity.sizeChangedOnBottom 
    || props.entity.sizeChangedOnLeft
    || props.entity.sizeChangedOnRight
    || props.entity.sizeChangedOnTop

  const realWidth = props.entity.width * scale
  const realHeight = props.entity.height * scale

  return (  
    <g className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <rect 
        className="block-decoration"
        x={props.entity.x * scale}
        y={props.entity.y * scale}
        width={realWidth}
        height={realHeight}
        stroke={interfaceColor}
        strokeWidth={1}
        stroke-dasharray="2,2"
        fill={'transparent'}
      >
      </rect>
      <foreignObject
        x={props.entity.x * scale}
        y={props.entity.y * scale}
        width={realWidth}
        height={realHeight}
      >
        {(realWidth >= interfaceControlElementSize * 3 * scale && realHeight >= interfaceControlElementSize * 3 * scale) ?
          <div 
            className={`delete-button ${isResized ? 'invisible' : 'on-hover-visible'}`}
            style={{
              right: interfaceControlElementSize / 2 * scale,
              top: interfaceControlElementSize / 2 * scale,
              width: interfaceControlElementSize * scale,
              height: interfaceControlElementSize * scale,
              backgroundImage: getBackgroundSvgImage(getSvgExit(scale, interfaceColor)),
            }}
            onMouseDown={(event) => { event.stopPropagation() }}
            onClick={(event) => { dispatch(removeEntity(props.entityId)) }}
          /> : ''
        } 
      </foreignObject>
      {
        [
          SizeControlType.top, SizeControlType.topRight, SizeControlType.right, SizeControlType.bottomRight,
          SizeControlType.bottom, SizeControlType.bottomLeft, SizeControlType.left, SizeControlType.topLeft,
        ].map((direction, index) => (
          <SizeController 
            key={index}
            entityId={props.entityId}
            entity={props.entity}
            radius={interfaceControlElementSize}
            decorationRadius={interfaceControlElementSize / 2}
            color={interfaceColor}
            sizeControlType={direction}
          />
        ))
      }
      {
        props.entity.blocks.map((block, index) => {
          
        })
      }
    </g>
  )
  
  /*return (  
    <g className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <rect 
        className="block-decoration"
        x={props.entity.x * scale + 'px'}
        y={props.entity.y * scale + 'px'}
        width={props.entity.width * scale + 'px'}
        height={props.entity.height * scale + 'px'}
        stroke={props.entity.selected ? 'orange' : isHovered ? 'red' : 'black'}
        strokeWidth={1}
        fill={'white'}
      >
      </rect>
      <foreignObject
        x={props.entity.x * scale + 'px'}
        y={props.entity.y * scale + 'px'}
        style={{overflow: 'visible'}}
      >
        <div 
          className='block-content'
          contentEditable="true"
          onBlur={(e: any) => {
            props.setContent(e.currentTarget.innerText)
          }}
          style={{        
            minWidth: props.entity.width * scale + 'px',
            left: `${(props.entity.width / 2) * scale}px`,
            top: `${(props.entity.height / 2) * scale}px`,
            fontSize: 0.2 * scale + 'em',
          }}
        >
          {props.entity.content}
        </div>
      </foreignObject>
      <foreignObject
        x={(props.entity.x + props.entity.width - props.entity.height / 7) * scale + 'px'}
        y={props.entity.y * scale + 'px'}
        width={props.entity.height / 7 * scale + 'px'}
        height={props.entity.height / 7 * scale + 'px'}
      >
        <button 
          className="delete-button on-hover-visible"
          style={{
            width: `100%`,
            height: `100%`,
          }}
          onClick={props.deleteBlock}
        />
      </foreignObject>
    </g>
  )*/
}