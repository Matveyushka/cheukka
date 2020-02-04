import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { ConnectionType } from '../ConnectionType'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { Entity } from '../..'
import { getIntermediatePoints } from './intermediatePointsCalculator'
import { ConnectionDirection } from '../ConnectionDirection'

export class Connection {
  constructor(
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
  intermediatePoints: Array<IntermediateConnectionPoint> = []

  calculateIntermediatePoints = (entities: Map<number, Entity>, thisConnection: Connection) => {
    thisConnection.intermediatePoints = getIntermediatePoints(thisConnection.begin, thisConnection.end, entities)
  }
}