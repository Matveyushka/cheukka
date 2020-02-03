import { ConnectionPathPoint } from '.'
import { Entity } from '../..'

export class IntermediateConnectionPoint extends ConnectionPathPoint {
  constructor (x: number, y: number, fixed: boolean) {
    super()
    this.x = x
    this.y = y
  }

  x: number
  y: number
  fixed: boolean

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.x
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.y
}