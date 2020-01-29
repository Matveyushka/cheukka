import { ConnectionType } from '../types'
import * as SvgArrows from '../svg/arrows'

export const ConnectionTypeArrows = new Map<ConnectionType, SvgArrows.connectionEndSvgCreator>([
  [ConnectionType.BlockSchemeArrow, SvgArrows.getBlockSchemeArrow],
  [ConnectionType.Connecting, SvgArrows.getConnectingArrow]
])