import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
  START_SCALE
} from '../constants'
import {
  Entity,
  ConnectionArea,
  ConnectionPathPoint,
  FreeConnectionPoint
} from '../types'
import {
  getTheClosestSegmentPointToFreePoint
} from './geometry'
import { ConnectionAreaContainer } from '../components/ConnectionAreaContainer'

export const vwToPx = (vw: number) => {
  return vw * (window.innerWidth / 100)
}

export const pxToVw = (px: number) => {
  return px / (window.innerWidth / 100)
}

export const vhToPx = (vh: number) => {
  return vh * (window.innerHeight / 100)
}

export const pxToVh = (px: number) => {
  return px / (window.innerHeight / 100)
}

export const getScale = (scaleStep: number) => {
  return 1.1 ** scaleStep - 0.1
}

export const getScalePercent = (scaleStep: number) => {
  return Math.round(getScale(scaleStep) / getScale(START_SCALE) * 100) + '%'
}

export const roundEntityCoordinateOrSize = (value: number) => {
  return Math.round(value / (DEFAULT_CANVAS_WIDTH / 100)) * (DEFAULT_CANVAS_WIDTH / 100)
}

export const roundConnectionCoordinateOrSize = (value: number) => {
  return Math.round(value / (DEFAULT_CANVAS_WIDTH / 200)) * (DEFAULT_CANVAS_WIDTH / 200)
}

export const isPointInRectangle = (
  pointX: number,
  pointY: number,
  rectangleX: number,
  rectangleY: number,
  rectangleWidth: number,
  rectangleHeight: number) => rectangleX <= pointX && (rectangleX + rectangleWidth) >= pointX &&
  rectangleY <= pointY && (rectangleY + rectangleHeight) >= pointY

export const getScaledOffsets = (
  prevOffsetX: number,
  prevOffsetY: number,
  scaleFocusX: number,
  scaleFocusY: number,
  newScale: number,
  oldScale: number,
) => {
  const oldFocusPointX = scaleFocusX + prevOffsetX
  const oldFocusPointY = scaleFocusY + prevOffsetY

  const scalesRatio = getScale(newScale) / getScale(oldScale)

  const newFocusPointX = (oldFocusPointX - DEFAULT_EMPTY_SPACE_WIDTH) * scalesRatio + DEFAULT_EMPTY_SPACE_WIDTH
  const newFocusPointY = (oldFocusPointY - DEFAULT_EMPTY_SPACE_HEIGHT) * scalesRatio + DEFAULT_EMPTY_SPACE_HEIGHT

  const _offsetX = newFocusPointX - scaleFocusX
  const _offsetY = newFocusPointY - scaleFocusY

  return {
    _offsetX,
    _offsetY
  }
}

export const getCanvasX = (event: React.MouseEvent, scale: number) => {
  const clientRect = document.getElementsByClassName('diagram-canvas')[0].getBoundingClientRect()
  return (event.clientX - clientRect.left) / scale
}

export const getCanvasY = (event: React.MouseEvent, scale: number) => {
  const clientRect = document.getElementsByClassName('diagram-canvas')[0].getBoundingClientRect()
  return (event.clientY - clientRect.top) / scale
}

export const getTheClosestAreaPointPosition = (
  sourcePointX: number,
  sourcePointY: number,
  entity: Entity,
  area: ConnectionArea,
) => {
  const freePoint = { x: sourcePointX, y: sourcePointY }
  const segmentBegin = { x: entity.x + area.xBegin, y: entity.y + area.yBegin }
  const segmentEnd = { x: entity.x + area.xEnd, y: entity.y + area.yEnd }

  const { x, y } = getTheClosestSegmentPointToFreePoint(
    freePoint,
    segmentBegin,
    segmentEnd,
  )

  const costyl1 = x === Infinity ? 0 : (x - segmentBegin.x) ** 2
  const costyl2 = y === Infinity ? 0 : (y - segmentBegin.y) ** 2

  const segmentLength = Math.sqrt((segmentEnd.x - segmentBegin.x) ** 2 + (segmentEnd.y - segmentBegin.y) ** 2)
  const pointDistantionFromBegin = Math.sqrt(costyl1 + costyl2)

  return segmentLength === 0 ? 0.5 : Math.abs(pointDistantionFromBegin / segmentLength)
}

export const applyFontSize = (fontSize: number) => {
  document.execCommand("fontSize", false, "7")
  Array.from(document.getElementsByTagName("font")).forEach((element) => {
    if (element.size == "7") {
      element.removeAttribute("size")
      element.style.fontSize = "" + fontSize + "px"
    }
  })
}