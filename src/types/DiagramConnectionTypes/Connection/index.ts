import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { ConnectionType } from '../ConnectionType'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { Entity } from '../..'
import { getIntermediatePoints } from './intermediatePointsCalculator'
import { ConnectionSettings } from '../../Settings/ConnectionSettings'
import { store } from '../../../stores/index'

export class Connection {
  constructor(
    public begin: ConnectionPathPoint,
    public end: ConnectionPathPoint,
    public type: ConnectionType
  ) { }

  isHovered: boolean = false
  intermediatePoints: Array<IntermediateConnectionPoint> = []
  selected: boolean = false
  settings: ConnectionSettings = store.getState().defaultConnectionSettings

  calculateIntermediatePoints = (entities: Map<number, Entity>, thisConnection: Connection) => {
    thisConnection.intermediatePoints = getIntermediateWay(thisConnection, [], thisConnection.begin, 0, entities)
  }

  getConnectionBounds = () => {
    const xs = [
      this.begin.getX(this.end),
      this.end.getX(this.begin),
      ...this.intermediatePoints.map(point => point.getX()) 
    ]

    const ys = [
      this.begin.getY(this.end),
      this.end.getY(this.begin),
      ...this.intermediatePoints.map(point => point.getY()) 
    ]

    return {
      top: ys.reduce((a: number, v: number) => Math.min(a, v)),
      right: xs.reduce((a: number, v: number) => Math.max(a, v)),
      bottom: ys.reduce((a: number, v: number) => Math.max(a, v)),
      left: xs.reduce((a: number, v: number) => Math.min(a, v))
    }
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