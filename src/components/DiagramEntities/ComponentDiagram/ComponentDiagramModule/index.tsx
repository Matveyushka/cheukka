import { Entity } from '../../../../types/DiagramEntityTypes/Entity'
import { ConnectionArea, ConnectionDirection } from '../../../../types/'
import { EntityBlockRectangle } from '../../../../svg'
import { EntityPart, EntityType } from '../../../../types'
import { EntityBlock } from '../../../../types/DiagramEntityTypes/EntityPart'

export class ComponentDiagramModule extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(EntityType.ComponentModule ,x, y, width, height)
    
    this.parts = [
      new EntityPart((entity: Entity) => new EntityBlock(
        3, 0, Math.max(entity.width - 3, 0), entity.height, EntityBlockRectangle
      ), true, 'Component'),
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0.9 * entity.height - 2, 6, 2, EntityBlockRectangle
      ), false),
      new EntityPart((entity: Entity) => new EntityBlock(
        0, 0.1 * entity.height, 6, 2, EntityBlockRectangle
      ), false),
    ]

    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionArea(3, 0, entity.width, 0, [ConnectionDirection.Top]),
    ]
  }
}