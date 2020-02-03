import { ConnectionPathPoint } from './ConnectionPathPoint'
import { ConnectionType } from './ConnectionType'
import { IntermediateConnectionPoint } from './ConnectionPathPoint/IntermediateConnectionPoint'
import { Entity } from '..'
import { ConnectionAreaPoint } from './ConnectionPathPoint/ConnectionAreaPoint'
import { EntityConnectionPoint } from './ConnectionPathPoint/EntityConnectionPoint'

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
    this.intermediatePoints[0] = thisConnection.calculateSingleIntermediatePoint(
      thisConnection.begin,
      thisConnection.end, entities
    )
  }

  calculateSingleIntermediatePoint = (
    previousPoint: ConnectionPathPoint,
    nextPoint: ConnectionPathPoint,
    entities: Map<number, Entity>
  ) => {
    return new IntermediateConnectionPoint(
      nextPoint.getX(previousPoint, entities),
      previousPoint.getY(nextPoint, entities),
      false
    )
  }
}