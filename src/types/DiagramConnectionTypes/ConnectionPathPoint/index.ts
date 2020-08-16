import { Entity } from '../..'

export abstract class ConnectionPathPoint {
  abstract getX: (oppositePoint?: ConnectionPathPoint) => number
  abstract getY: (oppositePoint?: ConnectionPathPoint) => number
}