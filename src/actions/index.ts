import * as Constants from '../constants/actions'
import { Entity, Connection, MouseMode, DiagramEntityTypeChooserState, DiagramType, ConnectionTypeChooserState } from '../types'

//interfaces

export interface SetScale { type: Constants.SET_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface IncreaseScale { type: Constants.INCREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface DecreaseScale { type: Constants.DECREASE_SCALE; scale: number; scaleFocusX: number; scaleFocusY: number; }

export interface SetDiagramType { type: Constants.SET_DIAGRAM_TYPE; diagramType: DiagramType; }

export interface SetOffsetX { type: Constants.SET_XOFFSET; offset: number; }

export interface SetOffsetY { type: Constants.SET_YOFFSET; offset: number; }

export interface AddEntity { type: Constants.ADD_ENTITY; entity: Entity }

export interface RemoveEntity { type: Constants.REMOVE_ENTITY; id: number }

export interface UpdateEntity { type: Constants.UPDATE_ENTITY; id: number; entity: Entity }

export interface AddConnection { type: Constants.ADD_CONNECTION; connection: Connection }

export interface RemoveConnection { type: Constants.REMOVE_CONNECTION; id: number }

export interface UpdateConnection { type: Constants.UPDATE_CONNECTION; id: number; connection: Connection }

export interface SetMouseMode { type: Constants.SET_MOUSE_MODE; mouseMode: MouseMode }

export interface SetCurrentDiagramConnection { type: Constants.SET_CURRENT_DIAGRAM_CONNECTION; connection: Connection }

export interface SetDiagramEntityTypeChooserState { type: Constants.SET_DIAGRAM_ENTITY_TYPE_CHOOSER_STATE; state: DiagramEntityTypeChooserState}

export interface SetConnectionTypeChooserState { type: Constants.SET_CONNECTION_TYPE_CHOOSER_STATE; state: ConnectionTypeChooserState}

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

export const setDiagramType = (diagramType: DiagramType) => ({
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

export const addConnection = (connection: Connection) : AddConnection => ({
  type: Constants.ADD_CONNECTION,
  connection,
})

export const removeConnection = (id: number) : RemoveConnection => ({
  type: Constants.REMOVE_CONNECTION,
  id,
})

export const updateConnection = (id: number, connection: Connection) : UpdateConnection => ({
  type: Constants.UPDATE_CONNECTION,
  id,
  connection,
})

export const setMouseMode = (mouseMode: MouseMode) : SetMouseMode => ({
  type: Constants.SET_MOUSE_MODE,
  mouseMode,
})

export const setCurrentDiagramConnection = (connection: Connection) : SetCurrentDiagramConnection => ({
  type: Constants.SET_CURRENT_DIAGRAM_CONNECTION,
  connection,
})

export const setDiagramEntityTypeChooserState = (state: DiagramEntityTypeChooserState) : SetDiagramEntityTypeChooserState => ({
  type: Constants.SET_DIAGRAM_ENTITY_TYPE_CHOOSER_STATE,
  state,
})

export const setConnectionTypeChooserState = (state: ConnectionTypeChooserState) : SetConnectionTypeChooserState => ({
  type: Constants.SET_CONNECTION_TYPE_CHOOSER_STATE,
  state,
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
  | AddConnection
  | RemoveConnection
  | UpdateConnection
  | SetMouseMode
  | SetCurrentDiagramConnection
  | SetDiagramEntityTypeChooserState
  | SetConnectionTypeChooserState