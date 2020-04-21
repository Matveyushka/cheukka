import { ConnectionPathPoint } from '.'
import { Entity } from '../..'

export class ConnectionAreaPoint extends ConnectionPathPoint {
  constructor (entityId: number, areaId: number, positionPercent: number) {
    super()
    this.entityId = entityId
    this.areaId = areaId
    this.positionPercent = positionPercent
  }

  entityId: number
  areaId: number
  positionPercent: number

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
    const entity = entities.get(this.entityId)
    const area = entity.connectionAreaCreators[this.areaId](entity)
    return entity.x + area.xBegin + (area.xEnd - area.xBegin) * this.positionPercent
  }
  
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
    const entity = entities.get(this.entityId)
    const area = entity.connectionAreaCreators[this.areaId](entity)
    return entity.y + area.yBegin + (area.yEnd - area.yBegin) * this.positionPercent
  }
}
