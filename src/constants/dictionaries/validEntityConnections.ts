import { EntityType } from '../../types'
import { ConnectionType } from '../../types'

export const validEntityConnectionsBegin = new Map<EntityType, Array<ConnectionType>>([
  [EntityType.BlockSchemeAction, [ConnectionType.BlockSchemeArrow]],
  [EntityType.BlockSchemeCondition, [ConnectionType.BlockSchemeArrow]],
])

export const validEntityConnectionsEnd = new Map<EntityType, Array<ConnectionType>>([
  [EntityType.BlockSchemeAction, [ConnectionType.BlockSchemeArrow]],
  [EntityType.BlockSchemeCondition, []],
])