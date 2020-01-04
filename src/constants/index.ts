import { vhToPx, vwToPx } from '../utils' 

export const SET_SCALE = 'SET_SCALE'
export type SET_SCALE = typeof SET_SCALE

export const INCREASE_SCALE = 'INCREASE_SCALE'
export type INCREASE_SCALE = typeof INCREASE_SCALE

export const DECREASE_SCALE = 'DECREASE_SCALE'
export type DECREASE_SCALE = typeof DECREASE_SCALE

export const SET_DIAGRAM_TYPE = 'SET_DIAGRAM_TYPE'
export type SET_DIAGRAM_TYPE = typeof SET_DIAGRAM_TYPE

export const SET_XOFFSET = 'SET_XOFFSET'
export type SET_XOFFSET = typeof SET_XOFFSET

export const SET_YOFFSET = 'SET_YOFFSET'
export type SET_YOFFSET = typeof SET_YOFFSET

export const MAX_SCALE = 31

export const START_SCALE = 16

export const MIN_SCALE = 1

export const SCALE_STEP = 1

export const DEFAULT_CANVAS_WIDTH = vwToPx(20)

export const DEFAULT_CANVAS_HEIGHT = vwToPx(28)

export const DEFAULT_EMPTY_SPACE_WIDTH = vwToPx(60)

export const DEFAULT_EMPTY_SPACE_HEIGHT = vhToPx(60)

export const LEFT_MOUSE_BUTTON = 2