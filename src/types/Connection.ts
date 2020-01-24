import { ConnectionAreaPoint } from './ConnectionAreaPoint'
import { FreeConnectionPoint } from './FreeConnectionPoint'

export class Connection {
  constructor (beginPoint: ConnectionAreaPoint | FreeConnectionPoint, endPoint: ConnectionAreaPoint | FreeConnectionPoint) {
    this.begin = beginPoint
    this.end = endPoint
  }

  begin: ConnectionAreaPoint | FreeConnectionPoint
  end: ConnectionAreaPoint | FreeConnectionPoint
}