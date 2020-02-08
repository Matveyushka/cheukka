import { ConnectionPathPoint } from '.'
import { Entity } from '../..'
import { ConnectionDirection } from '../ConnectionDirection'

export class IntermediateConnectionPoint extends ConnectionPathPoint {
  constructor (x: number, y: number, fixed: boolean, moved?: { movedX: boolean, movedY: boolean }) {
    super()
    this.x = x
    this.y = y
    this.fixed = fixed
    this.movedX = moved?.movedX ?? false
    this.movedY = moved?.movedY ?? false
  }

  x: number
  y: number
  fixed: boolean
  movedX: boolean
  movedY: boolean

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.x
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => this.y
}