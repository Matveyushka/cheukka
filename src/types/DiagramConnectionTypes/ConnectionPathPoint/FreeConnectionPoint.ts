import { ConnectionPathPoint } from '.'
import { Entity } from '../..'

export class FreeConnectionPoint extends ConnectionPathPoint{
  constructor (x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  x: number
  y: number

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.x
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.y
}