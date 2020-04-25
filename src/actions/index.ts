import * as Constants from '../constants/actions'
import { Entity, Connection, MouseMode, EntityTypeChooserState, DiagramType, ConnectionTypeChooserState } from '../types'
import { SaveSettings } from '../types/SaveSettings';

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

export interface SetEntityTypeChooserState { type: Constants.SET_ENTITY_TYPE_CHOOSER_STATE; state: EntityTypeChooserState}

export interface SetConnectionTypeChooserState { type: Constants.SET_CONNECTION_TYPE_CHOOSER_STATE; state: ConnectionTypeChooserState}

export interface SetSavePanelIsOpen { type: Constants.SET_SAVE_PANEL_IS_OPEN; isOpen: boolean}

export interface SetLastSaveSettings { type: Constants.SET_LAST_SAVE_SETTINGS; saveSettings: SaveSettings}

export interface SetIsSaving { type: Constants.SET_IS_SAVING; isSaving: boolean }

export interface SetTutorialIsOpen { type: Constants.SET_TUTORIAL_IS_OPEN; tutorialIsOpen: boolean }

export interface SetTextSettings { type: Constants.SET_TEXT_SETTINGS; textSettings: TextSettings }

export interface SetDefaultTextSettings { type: Constants.SET_DEFAULT_TEXT_SETTINGS; textSettings: TextSettings }

export interface SetTextSettingsAreOpen { type: Constants.SET_TEXT_SETTINGS_ARE_OPEN; areOpen: boolean }

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

export const setEntityTypeChooserState = (state: EntityTypeChooserState) : SetEntityTypeChooserState => ({
  type: Constants.SET_ENTITY_TYPE_CHOOSER_STATE,
  state,
})

export const setConnectionTypeChooserState = (state: ConnectionTypeChooserState) : SetConnectionTypeChooserState => ({
  type: Constants.SET_CONNECTION_TYPE_CHOOSER_STATE,
  state,
})

export const setSavePanelIsOpen = (isOpen: boolean) : SetSavePanelIsOpen => ({
  type: Constants.SET_SAVE_PANEL_IS_OPEN,
  isOpen,
})

export const setLastSaveSettings = (saveSettings: SaveSettings) : SetLastSaveSettings => ({
  type: Constants.SET_LAST_SAVE_SETTINGS,
  saveSettings
})

export const setIsSaving = (isSaving: boolean) : SetIsSaving => ({
  type: Constants.SET_IS_SAVING,
  isSaving
})

export const setTutorialIsOpen = (tutorialIsOpen: boolean) : SetTutorialIsOpen => ({
  type: Constants.SET_TUTORIAL_IS_OPEN,
  tutorialIsOpen
})

export const setTextSettings = (textSettings: TextSettings) : SetTextSettings => ({
  type: Constants.SET_TEXT_SETTINGS,
  textSettings
})

export const setDefaultTextSettings = (textSettings: TextSettings) : SetDefaultTextSettings => ({
  type: Constants.SET_DEFAULT_TEXT_SETTINGS,
  textSettings
})

export const setTextSettingsAreOpen = (areOpen: boolean) : SetTextSettingsAreOpen => ({
  type: Constants.SET_TEXT_SETTINGS_ARE_OPEN,
  areOpen,
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
  | SetEntityTypeChooserState
  | SetConnectionTypeChooserState
  | SetSavePanelIsOpen
  | SetLastSaveSettings
  | SetIsSaving
  | SetTutorialIsOpen
  | SetTextSettings
  | SetDefaultTextSettings
  | SetTextSettingsAreOpen