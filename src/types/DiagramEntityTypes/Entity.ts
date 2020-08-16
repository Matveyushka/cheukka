import { ConnectionArea } from '../DiagramConnectionTypes/ConnectionArea'
import { EntityPart } from './EntityPart'
import { ConnectionPoint } from '../DiagramConnectionTypes/ConnectionPoint'
import { EntityType } from './EntityType'
import { EntitySettings } from '../Settings/EntitySettings'
import { store } from '../../stores/index'

export abstract class Entity {
  constructor (type: EntityType, x: number, y: number, width: number, height: number) {
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  type: EntityType
  x: number
  y: number
  width: number
  height: number
  selected = false
  sizeChangedOnTop = false
  sizeChangedOnLeft = false
  sizeChangedOnRight = false
  sizeChangedOnBottom = false
  settings: EntitySettings = store.getState().defaultEntitySettings
  moved = false
  movementOriginX: number
  movementOriginY: number
  parts: Array<EntityPart>
  connectionAreaCreators: Array<(entity: Entity) => ConnectionArea> = []
  connectionPointCreators: Array<(entity: Entity) => ConnectionPoint> = []
  areaConnectionMode: boolean = true
  isHovered: boolean = false
  heightToContentAdapter?: (entityId: number, scale: number) => number
}

export const areEntitiesEqual = (entity1: Entity, entity2: Entity) => {
  return (
    entity1.type === entity2.type &&
    entity1.x === entity2.x &&
    entity1.y === entity2.y &&
    entity1.width === entity2.width &&
    entity1.height === entity2.height
  )
}