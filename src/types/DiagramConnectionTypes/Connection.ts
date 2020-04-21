import * as React from 'react'
import { ConnectionPathPoint } from './ConnectionPathPoint'
import { ConnectionType } from './ConnectionType'

export class Connection {
  constructor (
    beginPoint: ConnectionPathPoint,
    endPoint: ConnectionPathPoint,
    type: ConnectionType
  ) {
    this.begin = beginPoint
    this.end = endPoint
    this.type = type
  }

  begin: ConnectionPathPoint
  end: ConnectionPathPoint
  type: ConnectionType
  isHovered: boolean
}