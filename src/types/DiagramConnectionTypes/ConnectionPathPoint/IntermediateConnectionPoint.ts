import { ConnectionPathPoint } from '.'
import { Entity } from '../..'
import { ConnectionDirection } from '../ConnectionDirection'

export class IntermediateConnectionPoint extends ConnectionPathPoint {
  constructor (x: number, y: number, fixed: boolean, direction: ConnectionDirection) {
    super()
    this.x = x
    this.y = y
    this.fixed = fixed
    this.direction = direction
  }

  x: number
  y: number
  fixed: boolean
  direction: ConnectionDirection

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.x
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.y
}