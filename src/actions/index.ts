import * as Constants from '../constants/actions'
import { Entity } from '../types'

//interfaces

export interface SetScale { type: Constants.SET_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface IncreaseScale { type: Constants.INCREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface DecreaseScale { type: Constants.DECREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface SetDiagramType { type: Constants.SET_DIAGRAM_TYPE; diagramType: string; }

export interface SetOffsetX { type: Constants.SET_XOFFSET; offset: number; }

export interface SetOffsetY { type: Constants.SET_YOFFSET; offset: number; }

export interface AddEntity { type: Constants.ADD_ENTITY; entity: Entity }

export interface RemoveEntity { type: Constants.REMOVE_ENTITY; id: number }

export interface UpdateEntity { type: Constants.UPDATE_ENTITY; id: number; entity: Entity }

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

export const addEntity = (entity: Entity) : AddEntity => ({
  type: Constants.ADD_ENTITY,
  entity,
})

export const removeEntity = (id: number) : RemoveEntity => ({
  type: Constants.REMOVE_ENTITY,
  id,
})

export const updateEntity = (id: number, entity: Entity) : UpdateEntity => ({
  type: Constants.UPDATE_ENTITY,
  id,
  entity,
})

export type Action = 
    SetScale 
  | IncreaseScale 
  | DecreaseScale 
  | SetDiagramType 
  | SetOffsetX 
  | SetOffsetY
  | AddEntity
  | RemoveEntity
  | UpdateEntity