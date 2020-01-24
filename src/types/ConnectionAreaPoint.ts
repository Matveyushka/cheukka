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
