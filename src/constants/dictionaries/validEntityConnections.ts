import { EntityType } from '../../types'
import { ConnectionType } from '../../types'

export const validEntityConnectionsBegin = new Map<EntityType, Array<ConnectionType>>([
  [EntityType.BlockSchemeAction, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeCondition, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeTerminal, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeData, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeProcess, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],

  [EntityType.UMLClass, [ConnectionType.Aggregation, ConnectionType.Association, ConnectionType.Composition, ConnectionType.Dependency, ConnectionType.Implementation, ConnectionType.Inheritance]],
])

export const validEntityConnectionsEnd = new Map<EntityType, Array<ConnectionType>>([
  [EntityType.BlockSchemeAction, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeCondition, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeTerminal, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeData, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],
  [EntityType.BlockSchemeProcess, [ConnectionType.BlockSchemeArrow, ConnectionType.Default]],

  [EntityType.UMLClass, [ConnectionType.Aggregation, ConnectionType.Association, ConnectionType.Composition, ConnectionType.Dependency, ConnectionType.Inheritance]],
])