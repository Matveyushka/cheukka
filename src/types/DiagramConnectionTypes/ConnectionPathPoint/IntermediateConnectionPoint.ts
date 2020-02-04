import { ConnectionPathPoint } from '.'
import { Entity } from '../..'
import { ConnectionDirection } from '../ConnectionDirection'

export class IntermediateConnectionPoint extends ConnectionPathPoint {
  constructor (x: number, y: number, fixed: boolean) {
    super()
    this.x = x
    this.y = y
    this.fixed = fixed
  }

  x: number
  y: number
  fixed: boolean

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.x
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.y
}