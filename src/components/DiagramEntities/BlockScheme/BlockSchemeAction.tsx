import { Entity, EntityPart, ConnectionType, ConnectionPoint, EntityType } from '../../../types'
import { ConnectionArea, ConnectionAreaDirection } from '../../../types/DiagramConnectionTypes/ConnectionArea'
import { EntityBlockRectangle } from '../../../svg'
import { EntityBlock } from '../../../types/DiagramEntityTypes/EntityPart'

export class BlockSchemeAction extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(EntityType.BlockSchemeAction ,x, y, width, height)

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
      (entity: Entity) => new ConnectionPoint(entity.width / 2, 0, [ConnectionAreaDirection.Top]),
      (entity: Entity) => new ConnectionPoint(entity.width, entity.height / 2, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, entity.height, [ConnectionAreaDirection.Bottom]),
      (entity: Entity) => new ConnectionPoint(0, entity.height / 2, [ConnectionAreaDirection.Left]),
    ]
  }
}