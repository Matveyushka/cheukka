import { Entity } from '../DiagramEntityTypes/Entity'

export enum ConnectionAreaDirection {
  Top,
  Bottom,
  Right,
  Left,
}

export const getOffsetsByConnectionAreaDirections = (directions: Array<ConnectionAreaDirection>) => {
  const offsetX = (()=>{
    if (directions.indexOf(ConnectionAreaDirection.Right) >= 0 &&
        directions.indexOf(ConnectionAreaDirection.Left) < 0) return 1
    if (directions.indexOf(ConnectionAreaDirection.Right) < 0 &&
        directions.indexOf(ConnectionAreaDirection.Left) >= 0) return -1
    return 0
  })()
  const offsetY = (()=>{
    if (directions.indexOf(ConnectionAreaDirection.Bottom) >= 0 &&
        directions.indexOf(ConnectionAreaDirection.Top) < 0) return 1
    if (directions.indexOf(ConnectionAreaDirection.Bottom) < 0 &&
        directions.indexOf(ConnectionAreaDirection.Top) >= 0) return -1
    return 0
  })()

  if (Math.abs(offsetX) + Math.abs(offsetY) === 2) {
    return [ offsetX / Math.SQRT2, offsetY / Math.SQRT2 ]
  } else if (Math.abs(offsetX) + Math.abs(offsetY) === 1) {
    return [ offsetX, offsetY ]
  }
}

export class ConnectionArea {
  constructor (xBegin : number, yBegin : number, xEnd : number, yEnd : number, directions: Array<ConnectionAreaDirection>) {
    [ this.visualOffsetX, this.visualOffseyY ] = getOffsetsByConnectionAreaDirections(directions)
    this.xBegin = xBegin
    this.yBegin = yBegin
    this.xEnd = xEnd
    this.yEnd = yEnd
    this.directions = directions
  }

  entityResizeHandler: (entity: Entity) => ConnectionArea;

  directions: Array<ConnectionAreaDirection>
  visualOffsetX: number
  visualOffseyY: number
  xBegin: number
  yBegin: number
  xEnd: number
  yEnd: number
}