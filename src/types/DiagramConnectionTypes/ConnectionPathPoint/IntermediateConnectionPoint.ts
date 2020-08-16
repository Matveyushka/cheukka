import { ConnectionPathPoint } from '.'
import { Entity } from '../..'
import { ConnectionDirection } from '../ConnectionDirection'

export class IntermediateConnectionPoint extends ConnectionPathPoint {
  constructor (
    public x: number, 
    public y: number, 
    public fixed: boolean, 
    public movedX?: boolean, 
    public movedY?: boolean, 
    public prevX?: number,
    public prevY?: number) {
    super()
  }

  getX = () => this.x
  getY = () => this.y
}