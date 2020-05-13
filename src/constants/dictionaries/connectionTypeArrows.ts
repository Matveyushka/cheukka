import { ConnectionType, Connection } from '../../types'
import * as SvgArrows from '../../svg/arrows'

export const connectionTypeArrows = new Map<ConnectionType, SvgArrows.connectionEndSvgCreator>([
  [ConnectionType.BlockSchemeArrow, SvgArrows.getBlockSchemeArrow],
  [ConnectionType.Connecting, SvgArrows.getConnectingArrow],
  [ConnectionType.Default, SvgArrows.getDefaultArrow],
  [ConnectionType.Association, SvgArrows.getAssociationArrow],
  [ConnectionType.Inheritance, SvgArrows.getInheritanceArrow],
  [ConnectionType.Implementation, SvgArrows.getInheritanceArrow],
  [ConnectionType.Dependency, SvgArrows.getAssociationArrow],
  [ConnectionType.Aggregation, SvgArrows.getAggregationArrow],
  [ConnectionType.Composition, SvgArrows.getCompositionArrow],
])