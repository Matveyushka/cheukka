import * as React from 'react'
import { Entity, EntityPart } from '../../../types'
import { ConnectionArea, ConnectionAreaDirection } from '../../../types/ConnectionArea'
import { DiagramEntityBlock } from '../DiagramEntityBlock'
import { EntityBlockRectangle } from '../../../svg'
import { EntityBlock } from '../../../types/EntityPart'

export class BlockSchemeAction extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)

    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0, entity.width, entity.height, EntityBlockRectangle
      ), true, 'Action')
    ]
    
    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, 0, entity.width, 0, [ConnectionAreaDirection.Top]),
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width, entity.height, 0, entity.height, [ConnectionAreaDirection.Bottom]),
      (entity: Entity) => new ConnectionArea(0, 0, 0, entity.height, [ConnectionAreaDirection.Left]),
    ]
  }
}