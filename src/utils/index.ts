import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
} from '../constants'

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

export const getScaledOffsets = (
  prevOffsetX: number,
  prevOffsetY: number,
  scaleFocusX: number,
  scaleFocusY: number,
  newScale: number,
  oldScale: number,
  ) => {
    const mfxo = scaleFocusX + prevOffsetX
    const mfyo = scaleFocusY + prevOffsetY

    const wid = DEFAULT_CANVAS_WIDTH * newScale + DEFAULT_EMPTY_SPACE_WIDTH * 2
    const hei = DEFAULT_CANVAS_HEIGHT * newScale + DEFAULT_EMPTY_SPACE_HEIGHT * 2

    const prevwid = DEFAULT_CANVAS_WIDTH * oldScale + DEFAULT_EMPTY_SPACE_WIDTH * 2
    const prevhei = DEFAULT_CANVAS_HEIGHT * oldScale + DEFAULT_EMPTY_SPACE_HEIGHT * 2

    const mfxn = (mfxo - DEFAULT_EMPTY_SPACE_WIDTH) * (wid - DEFAULT_EMPTY_SPACE_WIDTH * 2) / (prevwid - DEFAULT_EMPTY_SPACE_WIDTH * 2) + DEFAULT_EMPTY_SPACE_WIDTH
    const mfyn = (mfyo - DEFAULT_EMPTY_SPACE_HEIGHT) * (hei - DEFAULT_EMPTY_SPACE_HEIGHT * 2) / (prevhei - DEFAULT_EMPTY_SPACE_HEIGHT * 2) + DEFAULT_EMPTY_SPACE_HEIGHT

    const _offsetX = mfxn - scaleFocusX
    const _offsetY = mfyn - scaleFocusY

    return { _offsetX, _offsetY }
}