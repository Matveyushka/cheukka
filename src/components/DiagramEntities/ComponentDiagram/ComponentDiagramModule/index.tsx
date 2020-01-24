import * as React from 'react'
import { Entity } from '../../../../types/Entity'
import { ConnectionArea, ConnectionAreaDirection } from '../../../../types/ConnectionArea'
import { DiagramEntityBlock } from '../../DiagramEntityBlock'
import { EntityBlockRectangle } from '../../../../svg'

export class ComponentDiagramModule extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    
    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(3, 0, entity.width, 0, [ConnectionAreaDirection.Top]),
    ]
  }

  render = (entity: Entity) => {
    return (
      <>
        <DiagramEntityBlock
          parentEntity={entity}
          relativeX={3}
          relativeY={0}
          width={Math.max(entity.width - 3, 0)}
          height={entity.height}
          contentEditable={true}
          content='Ty pidor'
          svgComponent={EntityBlockRectangle}
        />
        <DiagramEntityBlock
          parentEntity={entity}
          relativeX={0}
          relativeY={0.1 * entity.height}
          width={6}
          height={2}
          contentEditable={false}
          svgComponent={EntityBlockRectangle}
        />
        <DiagramEntityBlock
          parentEntity={entity}
          relativeX={0}
          relativeY={0.9 * entity.height - 2}
          width={6}
          height={2}
          contentEditable={false}
          svgComponent={EntityBlockRectangle}
        />
      </>
    )
  }
}