import { ConnectionArea } from '../DiagramConnectionTypes/ConnectionArea'
import { EntityPart } from './EntityPart'
import { ConnectionType } from '../DiagramConnectionTypes/ConnectionType'
import { ConnectionPoint } from '../DiagramConnectionTypes/ConnectionPoint'
import { EntityType } from './EntityType'

export abstract class Entity {
  constructor (type: EntityType, x: number, y: number, width: number, height: number) {
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isHovered = false
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
  moved = false
  movementOriginX: number
  movementOriginY: number
  parts: Array<EntityPart>
  connectionAreaCreators: Array<(entity: Entity) => ConnectionArea> = []
  connectionPointCreators: Array<(entity: Entity) => ConnectionPoint> = []
  areaConnectionMode: boolean = true
  isHovered: boolean
}