import { Entity, EntityPart, ConnectionType, ConnectionPoint, EntityType } from '../../../types'
import { ConnectionArea, ConnectionDirection } from '../../../types/'
import { EntityBlockRombus} from '../../../svg'
import { EntityBlock } from '../../../types/DiagramEntityTypes/EntityPart'

export class BlockSchemeCondition extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(EntityType.BlockSchemeCondition ,x, y, width, height)
    
    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0, entity.width, entity.height, EntityBlockRombus
      ), true, 'Condition')
    ]

    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, entity.height / 2, entity.width / 2, 0, [ConnectionDirection.Top, ConnectionDirection.Left]),
      (entity: Entity) => new ConnectionArea(entity.width / 2, 0, entity.width, entity.height / 2, [ConnectionDirection.Top, ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width / 2, entity.height, entity.width, entity.height / 2, [ConnectionDirection.Bottom, ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionArea(0, entity.height / 2, entity.width / 2, entity.height, [ConnectionDirection.Bottom, ConnectionDirection.Left]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, 0, [ConnectionDirection.Top]),
      (entity: Entity) => new ConnectionPoint(entity.width, entity.height / 2, [ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, entity.height, [ConnectionDirection.Bottom]),
      (entity: Entity) => new ConnectionPoint(0, entity.height / 2, [ConnectionDirection.Left]),
    ]
  }
}