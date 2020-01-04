import * as Constants from '../constants'

//interfaces

export interface SetScale { type: Constants.SET_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface IncreaseScale { type: Constants.INCREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface DecreaseScale { type: Constants.DECREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface SetDiagramType { type: Constants.SET_DIAGRAM_TYPE; diagramType: string; }

export interface SetOffsetX { type: Constants.SET_XOFFSET; offset: number; }

export interface SetOffsetY { type: Constants.SET_YOFFSET; offset: number; }

//actions

export const setScale = (scale: number, scaleFocusX: number, scaleFocusY: number) : SetScale => ({
  type: Constants.SET_SCALE,
  scale: scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const increaseScale = (scale: number, scaleFocusX: number, scaleFocusY: number) : IncreaseScale => ({
  type: Constants.INCREASE_SCALE,
  scale: scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const decreaseScale = (scale: number, scaleFocusX: number, scaleFocusY: number) : DecreaseScale => ({
  type: Constants.DECREASE_SCALE,
  scale: scale,
  scaleFocusX: scaleFocusX,
  scaleFocusY: scaleFocusY
});

export const setDiagramType = (diagramType: string) => ({
  type: Constants.SET_DIAGRAM_TYPE,
  diagramType: diagramType
})

export const setOffsetX = (offset: number) : SetOffsetX => ({
  type: Constants.SET_XOFFSET,
  offset: offset
});

export const setOffsetY = (offset: number) : SetOffsetY => ({
  type: Constants.SET_YOFFSET,
  offset: offset
});

export type Action = SetScale | IncreaseScale | DecreaseScale | SetDiagramType | SetOffsetX | SetOffsetY