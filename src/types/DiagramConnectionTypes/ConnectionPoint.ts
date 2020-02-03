import { ConnectionArea, getOffsetsByConnectionAreaDirections } from './ConnectionArea'
import { ConnectionDirection } from './ConnectionDirection';

export class ConnectionPoint extends ConnectionArea {
  constructor (x: number, y: number, directions: Array<ConnectionDirection>, isForEntityConnectionType?: boolean) {
    super(x, y, x, y, directions)
    this.isForEntityConnectionType = isForEntityConnectionType;
    [ this.visualOffsetX, this.visualOffseyY ] = getOffsetsByConnectionAreaDirections(directions)
  }

  isForEntityConnectionType = false
}