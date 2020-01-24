import * as React from 'react'

export interface EntityPart {
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  entityResizeHandler: (entity: Entity) => EntityPart;
  render: (entity: Entity) => React.ReactElement;
}

export abstract class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  selected = false;
  sizeChangedOnTop = false;
  sizeChangedOnLeft = false;
  sizeChangedOnRight = false;
  sizeChangedOnBottom = false;
  moved = false;
  movementOriginX: number;
  movementOriginY: number;
  connectionAreas: Array<ConnectionArea>;
  render: (entity: Entity) => React.ReactElement
}

export class ConnectionArea {
  constructor (xBegin : number, yBegin : number, xEnd : number, yEnd : number, resizeHandler: (entity: Entity) => ConnectionArea) {
    this.xBegin = xBegin
    this.yBegin = yBegin
    this.xEnd = xEnd
    this.yEnd = yEnd
    this.entityResizeHandler = resizeHandler
  }

  entityResizeHandler: (entity: Entity) => ConnectionArea;

  xBegin: number;
  yBegin: number;
  xEnd: number;
  yEnd: number;
}

export class ConnectionAreaPoint {
  constructor (entityId: number, areaId: number, positionPercent: number) {
    this.entityId = entityId
    this.areaId = areaId
    this.positionPercent = positionPercent
  }

  entityId: number
  areaId: number
  positionPercent: number
}

export class FreeConnectionPoint {
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }

  x: number
  y: number
}

export class Connection {
  constructor (beginPoint: ConnectionAreaPoint | FreeConnectionPoint, endPoint: ConnectionAreaPoint | FreeConnectionPoint) {
    this.begin = beginPoint
    this.end = endPoint
  }

  begin: ConnectionAreaPoint | FreeConnectionPoint
  end: ConnectionAreaPoint | FreeConnectionPoint
}

export enum MouseMode {
  default,
  dragging,
  connecting,
}