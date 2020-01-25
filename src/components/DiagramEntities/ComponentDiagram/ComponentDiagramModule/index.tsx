import * as React from 'react'
import { Entity } from '../../../../types/Entity'
import { ConnectionArea, ConnectionAreaDirection } from '../../../../types/ConnectionArea'
import { DiagramEntityBlock } from '../../DiagramEntityBlock'
import { EntityBlockRectangle } from '../../../../svg'
import { EntityPart } from '../../../../types'
import { EntityBlock } from '../../../../types/EntityPart'

export class ComponentDiagramModule extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    
    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        3, 0, Math.max(entity.width - 3, 0), entity.height, EntityBlockRectangle
      ), true, 'Action'),
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0.9 * entity.height - 2, 6, 2, EntityBlockRectangle
      ), false),
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0.1 * entity.height, 6, 2, EntityBlockRectangle
      ), false),
    ]

    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(3, 0, entity.width, 0, [ConnectionAreaDirection.Top]),
    ]
  }
}