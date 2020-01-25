import { ConnectionArea } from './ConnectionArea'
import { EntityPart } from './EntityPart'

export abstract class Entity {
  constructor (x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  x: number;
  y: number;
  width: number;
  height: number;
  selected = false;
  sizeChangedOnTop = false;
  sizeChangedOnLeft = false;
  sizeChangedOnRight = false;
  sizeChangedOnBottom = false;
  moved = false;
  movementOriginX: number;
  movementOriginY: number;
  parts: Array<EntityPart>;
  connectionAreaCreators: Array<(entity: Entity) => ConnectionArea>;
}