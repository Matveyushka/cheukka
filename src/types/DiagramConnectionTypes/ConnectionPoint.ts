import { ConnectionArea, ConnectionAreaDirection, getOffsetsByConnectionAreaDirections } from './ConnectionArea'

export class ConnectionPoint extends ConnectionArea {
  constructor (x: number, y: number, directions: Array<ConnectionAreaDirection>) {
    super(x, y, x, y, directions);
    [ this.visualOffsetX, this.visualOffseyY ] = getOffsetsByConnectionAreaDirections(directions)
  }
}