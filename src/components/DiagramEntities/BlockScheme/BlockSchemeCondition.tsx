import { Entity, EntityPart, ConnectionType, ConnectionPoint } from '../../../types'
import { ConnectionArea, ConnectionAreaDirection } from '../../../types/DiagramConnectionTypes/ConnectionArea'
import { EntityBlockRombus} from '../../../svg'
import { EntityBlock } from '../../../types/DiagramEntityTypes/EntityPart'

export class BlockSchemeCondition extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height)
    
    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0, entity.width, entity.height, EntityBlockRombus
      ), true, 'Condition')
    ]

    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, entity.height / 2, entity.width / 2, 0, [ConnectionAreaDirection.Top, ConnectionAreaDirection.Left]),
      (entity: Entity) => new ConnectionArea(entity.width / 2, 0, entity.width, entity.height / 2, [ConnectionAreaDirection.Top, ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width / 2, entity.height, entity.width, entity.height / 2, [ConnectionAreaDirection.Bottom, ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionArea(0, entity.height / 2, entity.width / 2, entity.height, [ConnectionAreaDirection.Bottom, ConnectionAreaDirection.Left]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, 0, [ConnectionAreaDirection.Top]),
      (entity: Entity) => new ConnectionPoint(entity.width, entity.height / 2, [ConnectionAreaDirection.Right]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, entity.height, [ConnectionAreaDirection.Bottom]),
      (entity: Entity) => new ConnectionPoint(0, entity.height / 2, [ConnectionAreaDirection.Left]),
    ]

    this.connectionPointCreators = [

    ]

    this.validConnectionToBegin = [ConnectionType.BlockSchemeArrow]
  }
}