import { Entity } from '../..'

export abstract class ConnectionPathPoint {
  abstract getX: (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => number
  abstract getY: (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => number
}