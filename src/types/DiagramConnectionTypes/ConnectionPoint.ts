import { ConnectionArea, ConnectionAreaDirection, getOffsetsByConnectionAreaDirections } from './ConnectionArea'

export class ConnectionPoint extends ConnectionArea {
  constructor (x: number, y: number, directions: Array<ConnectionAreaDirection>, isForEntityConnectionType?: boolean) {
    super(x, y, x, y, directions)
    this.isForEntityConnectionType = isForEntityConnectionType;
    [ this.visualOffsetX, this.visualOffseyY ] = getOffsetsByConnectionAreaDirections(directions)
  }

  isForEntityConnectionType = false
}