import { ConnectionPathPoint } from '.'
import { getEntityConnectionPosition } from '../../../utils/geometry'
import { store } from '../../../stores'


export class EntityConnectionPoint extends ConnectionPathPoint {
  constructor (entityId: number) {
    super()
    this.entityId = entityId
  }

  entityId: number

  getX = (srcPoint: ConnectionPathPoint) => {
    const entities = store.getState().diagramEntities
    return getEntityConnectionPosition(srcPoint, entities.get(this.entityId), entities).x
  }
  
  getY = (srcPoint: ConnectionPathPoint) => {
    const entities = store.getState().diagramEntities
    return getEntityConnectionPosition(srcPoint, entities.get(this.entityId), entities).y
  }
}