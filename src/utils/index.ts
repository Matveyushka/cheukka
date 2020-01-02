import {
  defaultCanvasWidth,
  defaultCanvasHeight,
  defaultEmptySpaceWidth,
  defaultEmptySpaceHeight,
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

    const wid = defaultCanvasWidth * newScale + defaultEmptySpaceWidth * 2
    const hei = defaultCanvasHeight * newScale + defaultEmptySpaceHeight * 2

    const prevwid = defaultCanvasWidth * oldScale + defaultEmptySpaceWidth * 2
    const prevhei = defaultCanvasHeight * oldScale + defaultEmptySpaceHeight * 2

    const mfxn = (mfxo - defaultEmptySpaceWidth) * (wid - defaultEmptySpaceWidth * 2) / (prevwid - defaultEmptySpaceWidth * 2) + defaultEmptySpaceWidth
    const mfyn = (mfyo - defaultEmptySpaceHeight) * (hei - defaultEmptySpaceHeight * 2) / (prevhei - defaultEmptySpaceHeight * 2) + defaultEmptySpaceHeight

    const _offsetX = mfxn - scaleFocusX
    const _offsetY = mfyn - scaleFocusY

    return { _offsetX, _offsetY }
}