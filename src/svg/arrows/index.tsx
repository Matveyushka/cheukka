import * as React from 'react'
import { getScale } from '../../utils'
import { START_SCALE } from '../../constants'

export type connectionEndSvgCreator = (x: number, y: number, scale: number, color: string, size: number) => React.ReactElement

export const getConnectingArrow: connectionEndSvgCreator = (x: number, y: number, scale: number, color: string, size: number) => {
  const relativeScale = scale / getScale(START_SCALE) * size
  return (<path
    d={`M ${x * scale} ${y * scale}
        L ${x * scale + 5 * relativeScale} ${y * scale + 8 * relativeScale}
        L ${x * scale} ${y * scale + 5 * relativeScale}
        L ${x * scale - 5 * relativeScale} ${y * scale + 8 * relativeScale}`}
    fill={color}
  />)
}

export const getBlockSchemeArrow: connectionEndSvgCreator = (x: number, y: number, scale: number, color: string, size: number) => {
  const relativeScale = scale / getScale(START_SCALE) * size
  return (<path
    d={`M ${x * scale} ${y * scale}
        L ${x * scale + 5 * relativeScale} ${y * scale + 8 * relativeScale}
        L ${x * scale - 5 * relativeScale} ${y * scale + 8 * relativeScale}`}
    fill={color}
  />)
}


