import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { ConnectionType } from '../ConnectionType'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { Entity } from '../..'
import { getIntermediatePoints } from './intermediatePointsCalculator'
import { ConnectionSettings } from '../../Settings/ConnectionSettings'
import { store } from '../../../stores/index'

export class Connection {
  constructor(
    beginPoint: ConnectionPathPoint,
    endPoint: ConnectionPathPoint,
    type: ConnectionType
  ) {
    this.begin = beginPoint
    this.end = endPoint
    this.type = type
    console.log(store.getState().defaultConnectionSettings)
  }

  begin: ConnectionPathPoint
  end: ConnectionPathPoint
  type: ConnectionType
  isHovered: boolean = false
  intermediatePoints: Array<IntermediateConnectionPoint> = []
  selected: boolean = false
  settings: ConnectionSettings = store.getState().defaultConnectionSettings

  calculateIntermediatePoints = (entities: Map<number, Entity>, thisConnection: Connection) => {
    //thisConnection.intermediatePoints = getIntermediatePoints(thisConnection.begin, thisConnection.end, entities)
    thisConnection.intermediatePoints = getIntermediateWay(thisConnection, [], thisConnection.begin, 0, entities)
  }
}

const getIntermediateWay = (
  connection: Connection,
  way: Array<IntermediateConnectionPoint>,
  lastFixedPoint: ConnectionPathPoint,
  currentIntermediatePointIndex: number,
  entities: Map<number, Entity>) : Array<IntermediateConnectionPoint> => {
  if (currentIntermediatePointIndex === connection.intermediatePoints.length) {
    return [
      ...way,
      ...getIntermediatePoints(lastFixedPoint, connection.end, entities)
    ]
  } else if (connection.intermediatePoints[currentIntermediatePointIndex].fixed) {
    return getIntermediateWay(
      connection,
      [
        ...way,
        ...getIntermediatePoints(lastFixedPoint, connection.intermediatePoints[currentIntermediatePointIndex], entities),
        connection.intermediatePoints[currentIntermediatePointIndex]
      ],
      connection.intermediatePoints[currentIntermediatePointIndex],
      currentIntermediatePointIndex + 1,
      entities
    ) 
  } else {
    return getIntermediateWay(
      connection,
      way,
      lastFixedPoint,
      currentIntermediatePointIndex + 1,
      entities
    ) 
  }
}