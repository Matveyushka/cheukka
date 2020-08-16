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

  getX = () => this.x
  getY = () => this.y
}