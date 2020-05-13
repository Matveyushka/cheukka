import * as React from 'react'
import { EntitySettings } from '../../types/Settings/EntitySettings'

export type EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number, settings: EntitySettings) => React.ReactElement

export const EntityBlockRectangle: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number, settings: EntitySettings) => {
  return (
  <rect
    x={x * scale}
    y={y * scale}
    width={width * scale}
    height={height * scale}
    stroke={settings.borderColor}
    strokeWidth={settings.thickness}
    fill={settings.backgroundColor}
    onClick={() => { }}
  />)
}

export const EntityBlockRombus: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number, settings: EntitySettings) => {
  return (
  <path
    d={`
    M ${(x + width / 2) * scale} ${y * scale}
    L ${(x + width) * scale} ${(y + height / 2) * scale}
    L ${(x + width / 2) * scale} ${(y + height) * scale}
    L ${x * scale} ${(y + height / 2) * scale}
    L ${(x + width / 2) * scale} ${y * scale}
    `}
    stroke={settings.borderColor}
    strokeWidth={settings.thickness}
    fill={settings.backgroundColor}
    onClick={() => { }}
  />)
}

export const EntityBlockParallelogram: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number, settings: EntitySettings) => {
  return (
  <path
    d={`
    M ${(x + width / 6) * scale} ${y * scale}
    L ${(x + width) * scale} ${(y) * scale}
    L ${(x + 5* width / 6) * scale} ${(y + height) * scale}
    L ${x * scale} ${(y + height) * scale}
    L ${(x + width / 6) * scale} ${y * scale}
    `}
    stroke={settings.borderColor}
    strokeWidth={settings.thickness}
    fill={settings.backgroundColor}
    onClick={() => { }}
  />)
}

export const EntityBlockRadiusedRectangle: EntityBlockSvg = (x: number, y: number, width: number, height: number, scale: number, settings: EntitySettings) => {
  return (
  <rect
    x={x * scale}
    y={y * scale}
    width={width * scale}
    height={height * scale}
    rx={Math.min(width, height) / 2 * scale}
    ry={Math.min(width, height) / 2 * scale}
    stroke={settings.borderColor}
    strokeWidth={settings.thickness}
    fill={settings.backgroundColor}
    onClick={() => { }}
  />)
}
