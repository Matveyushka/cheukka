import * as React from 'react'
import { getScale } from '../utils'

export const getBackgroundSvgImage = (svg: string) => `url('data:image/svg+xml;base64,${svg}')`

export const getSvgExit = (scale: number, color: string) => {
  return window.btoa(`<svg width='10' height='10' xmlns='http://www.w3.org/2000/svg'>
    <rect width='10' height='10' fill='white'/>
    <line x1='0' y1='0' x2='10' y2='10' stroke='${color}' stroke-width='1.2' />
    <line x1='10' y1='0' x2='0' y2='10' stroke='${color}' stroke-width='1.2' />
  </svg>`)
}

export const getBackgroundSvg = (scale: number, backgroundBlocksAmountInWidth: number) => {
  const strokeWidthMultiplier = 1 / getScale(scale) / (10 / backgroundBlocksAmountInWidth)

  return window.btoa(`<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'>
  <defs>
     <pattern id='smallGrid' width='10' height='10' patternUnits='userSpaceOnUse'>
       <rect width='10' height='10' fill='white'/>
       <path d='M 10 0 L 0 0 0 10' fill='none' stroke='gray' stroke-width='${0.5 * strokeWidthMultiplier}'/>
     </pattern>
     <pattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'>
       <rect width='100' height='100' fill='url(#smallGrid)'/>
       <path d='M 100 0 L 0 0 0 100' fill='none' stroke='gray' stroke-width='${1 * strokeWidthMultiplier}'/>
     </pattern>
   </defs>
   <rect width='100' height='100' fill='url(#grid)' />
  </svg>`)
}

export type EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number) => React.ReactElement

export const EntityBlockRectangle: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number) => {
  return (
  <rect
    x={x * scale}
    y={y * scale}
    width={width * scale}
    height={height * scale}
    stroke='black'
    strokeWidth={1}
    fill='white'
    onClick={() => { }}
  />)
}

export const EntityBlockRombus: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number) => {
  return (
  <path
    d={`
    M ${(x + width / 2) * scale} ${y * scale}
    L ${(x + width) * scale} ${(y + height / 2) * scale}
    L ${(x + width / 2) * scale} ${(y + height) * scale}
    L ${x * scale} ${(y + height / 2) * scale}
    L ${(x + width / 2) * scale} ${y * scale}
    `}
    stroke='black'
    strokeWidth={1}
    fill='white'
    onClick={() => { }}
  />)
}