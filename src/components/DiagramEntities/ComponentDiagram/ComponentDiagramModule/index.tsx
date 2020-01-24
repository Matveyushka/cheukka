import * as React from 'react'
import { Entity, ConnectionArea } from '../../../../types'
import { DiagramEntityBlock } from '../../DiagramEntityBlock'
import { EntityBlockRectangle } from '../../../../svg'

export class ComponentDiagramModule extends Entity {
  area1 = (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, this.area1)
  area2 = (entity: Entity) => new ConnectionArea(3, 0, entity.width, 0, this.area2)

  constructor(x: number, y: number, width: number, height: number) {
    super()
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.connectionAreas = [
      new ConnectionArea(width, 0, width, height, this.area1),
      new ConnectionArea(3, 0, width, 0, this.area2)
    ] 
  }

  render = (entity: Entity) => {
    return (
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
    )
  }
}