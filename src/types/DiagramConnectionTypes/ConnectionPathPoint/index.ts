import { Entity } from '../..'

export abstract class ConnectionPathPoint {
  abstract getX: (oppositePoint: ConnectionPathPoint, entities: Map<number, Entity>) => number
  abstract getY: (oppositePoint: ConnectionPathPoint, entities: Map<number, Entity>) => number
}