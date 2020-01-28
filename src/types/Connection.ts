import { ConnectionPoint } from './ConnectionPoint'
import { ConnectionType } from './ConnectionType'

export class Connection {
  constructor (
    beginPoint: ConnectionPoint,
    endPoint: ConnectionPoint,
    type: ConnectionType
  ) {
    this.begin = beginPoint
    this.end = endPoint
    this.type = type
  }

  begin: ConnectionPoint
  end: ConnectionPoint
  type: ConnectionType
}