import { Entity, EntityPart, ConnectionType, ConnectionPoint, EntityType } from '../../../types'
import { ConnectionArea, ConnectionDirection } from '../../../types'
import { EntityBlockRectangle, EntityBlockParallelogram } from '../../../svg/blocks'
import { EntityBlock } from '../../../types/DiagramEntityTypes/EntityPart'

export class BlockSchemeData extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(EntityType.BlockSchemeAction ,x, y, width, height)

    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0, entity.width, entity.height, EntityBlockParallelogram
      ), true, 'Data')
    ]
    
    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(entity.width / 6, 0, entity.width, 0, [ConnectionDirection.Top]),
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width / 6 * 5, entity.height, [ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width / 6 * 5, entity.height, 0, entity.height, [ConnectionDirection.Bottom]),
      (entity: Entity) => new ConnectionArea(0, entity.height, entity.width / 6, 0, [ConnectionDirection.Left]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, 0, [ConnectionDirection.Top], true),
      (entity: Entity) => new ConnectionPoint(entity.width / 12 * 11, entity.height / 2, [ConnectionDirection.Right], true),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, entity.height, [ConnectionDirection.Bottom], true),
      (entity: Entity) => new ConnectionPoint(entity.width / 11, entity.height / 2, [ConnectionDirection.Left], true),
    ]
  }
}