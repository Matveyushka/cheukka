import * as React from 'react'
import { Entity } from '../../../types/Entity'
import { ConnectionArea, ConnectionAreaDirection } from '../../../types/ConnectionArea'
import { DiagramEntityBlock } from '../DiagramEntityBlock'
import { EntityBlockRectangle } from '../../../svg'

export class BlockSchemeAction extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    
    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, 0, entity.width, 0, [ConnectionAreaDirection.Top]),
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width, entity.height, 0, entity.height, [ConnectionAreaDirection.Bottom]),
      (entity: Entity) => new ConnectionArea(0, 0, 0, entity.height, [ConnectionAreaDirection.Left]),
    ]
  }

  render = (entity: Entity) => {
    return (
      <>
        <DiagramEntityBlock
          parentEntity={entity}
          relativeX={0}
          relativeY={0}
          width={entity.width}
          height={entity.height}
          contentEditable={true}
          content='Ty pidor'
          svgComponent={EntityBlockRectangle}
        />
      </>
    )
  }
}