import { ConnectionPathPoint } from '.'
import { store } from '../../../stores'

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

  getX = () => {
    const entity = store.getState().diagramEntities.get(this.entityId)
    const area = entity.connectionAreaCreators[this.areaId](entity)
    return entity.x + area.xBegin + (area.xEnd - area.xBegin) * this.positionPercent
  }
  
  getY = () => {
    const entity = store.getState().diagramEntities.get(this.entityId)
    const area = entity.connectionAreaCreators[this.areaId](entity)
    return entity.y + area.yBegin + (area.yEnd - area.yBegin) * this.positionPercent
  }
}
