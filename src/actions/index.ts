import * as Constants from '../constants'

//interfaces

export interface SetScale { type: Constants.SET_SCALE; Scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface IncreaseScale { type: Constants.INCREASE_SCALE; Scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface DecreaseScale { type: Constants.DECREASE_SCALE; Scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface SetScaleFocusX { type: Constants.SET_SCALE_FOCUS_X; coordinate: number; }

export interface SetScaleFocusY { type: Constants.SET_SCALE_FOCUS_Y; coordinate: number; }

export interface SetOffsetX { type: Constants.SET_XOFFSET; offset: number; }

export interface SetOffsetY { type: Constants.SET_YOFFSET; offset: number; }

//actions

export const setScale = (Scale: number, scaleFocusX: number, scaleFocusY: number) : SetScale => ({
  type: Constants.SET_SCALE,
  Scale: Scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const increaseScale = (Scale: number, scaleFocusX: number, scaleFocusY: number) : IncreaseScale => ({
  type: Constants.INCREASE_SCALE,
  Scale: Scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const decreaseScale = (Scale: number, scaleFocusX: number, scaleFocusY: number) : DecreaseScale => ({
  type: Constants.DECREASE_SCALE,
  Scale: Scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const setScaleFocusX = (coordinate: number) : SetScaleFocusX => ({
  type: Constants.SET_SCALE_FOCUS_X,
  coordinate: coordinate
});

export const setScaleFocusY = (coordinate: number) : SetScaleFocusY => ({
  type: Constants.SET_SCALE_FOCUS_Y,
  coordinate: coordinate
});

export const setOffsetX = (offset: number) : SetOffsetX => ({
  type: Constants.SET_XOFFSET,
  offset: offset
});

export const setOffsetY = (offset: number) : SetOffsetY => ({
  type: Constants.SET_YOFFSET,
  offset: offset
});

export type Action = SetScale | IncreaseScale | DecreaseScale | SetOffsetX | SetOffsetY;