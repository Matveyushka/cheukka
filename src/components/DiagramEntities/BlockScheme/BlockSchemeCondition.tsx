import * as React from 'react'
import { Entity } from '../../../types/Entity'
import { ConnectionArea, ConnectionAreaDirection } from '../../../types/ConnectionArea'
import { DiagramEntityBlock } from '../DiagramEntityBlock'
import { EntityBlockRombus} from '../../../svg'

export class BlockSchemeCondition extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    
    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, entity.height / 2, entity.width / 2, 0, [ConnectionAreaDirection.Top, ConnectionAreaDirection.Left]),
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
          svgComponent={EntityBlockRombus}
        />
      </>
    )
  }
}