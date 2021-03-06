import { Store } from '../stores';
import { Action } from '../actions';
import {
  SET_SCALE,
  SET_XOFFSET,
  SET_YOFFSET,
  INCREASE_SCALE,
  DECREASE_SCALE,
  SET_DIAGRAM_TYPE,
  ADD_ENTITY,
  REMOVE_ENTITY,
  UPDATE_ENTITY,
  ADD_CONNECTION,
  REMOVE_CONNECTION,
  UPDATE_CONNECTION,
  SET_MOUSE_MODE,
  SET_CURRENT_DIAGRAM_CONNECTION,
  SET_ENTITY_TYPE_CHOOSER_STATE,
  SET_CONNECTION_TYPE_CHOOSER_STATE,
  SET_SAVE_PANEL_IS_OPEN,
  SET_LAST_SAVE_SETTINGS,
  SET_IS_SAVING,
  SET_TUTORIAL_IS_OPEN,
  SET_TEXT_SETTINGS,
  SET_TEXT_SETTINGS_ARE_OPEN,
  SET_DEFAULT_TEXT_SETTINGS,
  SET_ENTITY_SETTINGS_ARE_OPEN,
  SET_ENTITY_SETTINGS,
  SET_DEFAULT_ENTITY_SETTINGS,
  SET_CONNECTION_SETTINGS_ARE_OPEN,
  SET_CONNECTION_SETTINGS,
  SET_DEFAULT_CONNECTION_SETTINGS,
  SET_ABOUT_IS_OPEN,
  SET_ACTUAL_VERSION_IS_SAVED,
  ADD_DIAGRAM_ENTITIES_STAMP,
  RECOVERY_LAST_DIAGRAM_ENTITIES_STAMP,
} from '../constants/actions'
import {
  MAX_SCALE,
  MIN_SCALE,
} from '../constants';
import { getScaledOffsets } from '../utils'
import { ConnectionAreaPoint, EntityConnectionPoint } from '../types';

const getNextMapId = (anyMap: Map<number, any>) => anyMap.size === 0 ?
  0 :
  Math.max(...Array.from(anyMap.keys())) + 1

const removeEntity = (state: Store, entityId: number) => {
  const newDiagramEntities = new Map(state.diagramEntities)
  newDiagramEntities.delete(entityId)
  const newDiagramConnections = new Map(state.diagramConnections)
  Array.from(newDiagramConnections.entries()).forEach(entrie => {
    if (entrie[1].begin instanceof ConnectionAreaPoint && entrie[1].begin.entityId === entityId) {
      newDiagramConnections.delete(entrie[0])
    } else if (entrie[1].end instanceof ConnectionAreaPoint && entrie[1].end.entityId === entityId) {
      newDiagramConnections.delete(entrie[0])
    } else if (entrie[1].begin instanceof EntityConnectionPoint && entrie[1].begin.entityId === entityId) {
      newDiagramConnections.delete(entrie[0])
    } else if (entrie[1].end instanceof EntityConnectionPoint && entrie[1].end.entityId === entityId) {
      newDiagramConnections.delete(entrie[0])
    }
  })
  return { 
    ...state, 
    diagramEntities: newDiagramEntities, 
    diagramConnections: newDiagramConnections,  
    entitySettingsAreOpen: false,
    connectionSettingsAreOpen: false,
    actualVersionSaved: false
  }
}

export const mainReducer = (state: Store, action: Action): Store => {

  switch (action.type) {
    case SET_SCALE:
      const { _offsetX, _offsetY } = getScaledOffsets(
        state.offsetX,
        state.offsetY,
        action.scaleFocusX,
        action.scaleFocusY,
        action.scale,
        state.scaleLevel)

      return { ...state, prevScale: +state.scaleLevel, scaleLevel: +action.scale, offsetX: _offsetX, offsetY: _offsetY }
    case INCREASE_SCALE:
      if (state.scaleLevel + action.scale <= MAX_SCALE) {
        const { _offsetX, _offsetY } = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.scaleLevel + action.scale,
          state.scaleLevel)

        return { ...state, prevScale: +state.scaleLevel, scaleLevel: +state.scaleLevel + action.scale, offsetX: _offsetX, offsetY: _offsetY }
      }
      return state
    case DECREASE_SCALE:
      if (state.scaleLevel - action.scale >= MIN_SCALE) {
        const { _offsetX, _offsetY } = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.scaleLevel - action.scale,
          state.scaleLevel)

        return { ...state, prevScale: +state.scaleLevel, scaleLevel: +state.scaleLevel - action.scale, offsetX: _offsetX, offsetY: _offsetY }
      }
      return state
    case SET_DIAGRAM_TYPE:
      return { ...state, diagramType: action.diagramType }
    case SET_XOFFSET:
      return { ...state, offsetX: action.offset }
    case SET_YOFFSET:
      return { ...state, offsetY: action.offset }
    case ADD_ENTITY:
      const newAddDiagramEntities = new Map(state.diagramEntities)
      newAddDiagramEntities.set(getNextMapId(state.diagramEntities), action.entity)
      return { ...state, diagramEntities: newAddDiagramEntities, actualVersionSaved: false }
    case REMOVE_ENTITY:
      return removeEntity(state, action.id)
    case UPDATE_ENTITY:
      const updatedDiagramEntities = new Map(state.diagramEntities)
      updatedDiagramEntities.set(action.id, action.entity)
      return { ...state, diagramEntities: updatedDiagramEntities, actualVersionSaved: false }
    case ADD_CONNECTION:
      const newAddDiagramConnections = new Map(state.diagramConnections)
      newAddDiagramConnections.set(getNextMapId(state.diagramConnections), action.connection)
      return { ...state, diagramConnections: newAddDiagramConnections, actualVersionSaved: false }
    case REMOVE_CONNECTION:
      const newRemoveDiagramConnections = new Map(state.diagramConnections)
      newRemoveDiagramConnections.delete(action.id)
      return { ...state, diagramConnections: newRemoveDiagramConnections, connectionSettingsAreOpen: false, actualVersionSaved: false }
    case UPDATE_CONNECTION:
      const updatedDiagramConnetions = new Map(state.diagramConnections)
      updatedDiagramConnetions.set(action.id, action.connection)
      return { ...state, diagramConnections: updatedDiagramConnetions, actualVersionSaved: false }
    case SET_MOUSE_MODE:
      return { ...state, mouseMode: action.mouseMode }
    case SET_CURRENT_DIAGRAM_CONNECTION:
      return { ...state, currentDiagramConnection: action.connection }
    case SET_ENTITY_TYPE_CHOOSER_STATE:
      return { ...state, entityTypeChooserState: action.state }
    case SET_CONNECTION_TYPE_CHOOSER_STATE:
      return { ...state, connectionTypeChooserState: action.state }
    case SET_SAVE_PANEL_IS_OPEN:
      return { ...state, savePanelIsOpen: action.isOpen }
    case SET_LAST_SAVE_SETTINGS:
      return { ...state, lastSaveSettings: action.saveSettings }
    case SET_IS_SAVING:
      return { ...state, isSaving: action.isSaving }
    case SET_TUTORIAL_IS_OPEN:
      return { ...state, tutorialIsOpen: action.tutorialIsOpen }
    case SET_TEXT_SETTINGS:
      return { ...state, textSettings: action.textSettings }
    case SET_DEFAULT_TEXT_SETTINGS:
      return { ...state, defaultTextSettings: action.textSettings }
    case SET_TEXT_SETTINGS_ARE_OPEN:
      return { ...state, textSettingsAreOpen: action.areOpen }
    case SET_ENTITY_SETTINGS_ARE_OPEN:
      return { ...state, entitySettingsAreOpen: action.areOpen }
    case SET_ENTITY_SETTINGS:
      return { ...state, entitySettings: action.entitySettings }
    case SET_DEFAULT_ENTITY_SETTINGS:
      return { ...state, defaultEntitySettings: action.entitySettings }
    case SET_CONNECTION_SETTINGS_ARE_OPEN:
      return { ...state, connectionSettingsAreOpen: action.areOpen }
    case SET_CONNECTION_SETTINGS:
      return { ...state, connectionSettings: action.connectionSettings }
    case SET_DEFAULT_CONNECTION_SETTINGS:
      return { ...state, defaultConnectionSettings: action.connectionSettings }
    case SET_ABOUT_IS_OPEN:
      return { ...state, aboutIsOpen: action.isOpen }
    case SET_ACTUAL_VERSION_IS_SAVED:
      return { ...state, actualVersionSaved: action.isSaved }
    case ADD_DIAGRAM_ENTITIES_STAMP:
      return { ...state, diagramEntitiesHistory: [...state.diagramEntitiesHistory, state.diagramEntities] }
    case RECOVERY_LAST_DIAGRAM_ENTITIES_STAMP:
      if (state.diagramEntitiesHistory.length < 2) {
        return state
      } else {
        return {
          ...state,
          diagramEntities: state.diagramEntitiesHistory[state.diagramEntitiesHistory.length - 2],
          diagramEntitiesHistory: state.diagramEntitiesHistory.slice(0, state.diagramEntitiesHistory.length - 1)
        }
      }
  }

  return state
}