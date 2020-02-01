import { ConnectionPathPoint } from '.'
import { Entity } from '../..'
import { getIt } from '../../../utils/geometry'


export class EntityConnectionPoint extends ConnectionPathPoint {
  constructor (entityId: number) {
    super()
    this.entityId = entityId
  }

  entityId: number

  getX = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
    return getIt(srcPoint, entities.get(this.entityId), entities).x
  }
  
  getY = (srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
    return getIt(srcPoint, entities.get(this.entityId), entities).y
  }
}