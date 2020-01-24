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
} from '../constants/actions'
import {
  MAX_SCALE,
  MIN_SCALE,
} from '../constants';
import { getScaledOffsets } from '../utils'
import { ConnectionAreaPoint } from '../types';

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
    }
  })
  return { ...state, diagramEntities: newDiagramEntities, diagramConnections: newDiagramConnections }
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
        state.scale)

      return { ...state, prevScale: +state.scale, scale: +action.scale, offsetX: _offsetX, offsetY: _offsetY }
    case INCREASE_SCALE:
      if (state.scale + action.scale <= MAX_SCALE) {
        const { _offsetX, _offsetY } = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.scale + action.scale,
          state.scale)

        return { ...state, prevScale: +state.scale, scale: +state.scale + action.scale, offsetX: _offsetX, offsetY: _offsetY }
      }
      return state
    case DECREASE_SCALE:
      if (state.scale - action.scale >= MIN_SCALE) {
        const { _offsetX, _offsetY } = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.scale - action.scale,
          state.scale)

        return { ...state, prevScale: +state.scale, scale: +state.scale - action.scale, offsetX: _offsetX, offsetY: _offsetY }
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
      return { ...state, diagramEntities: newAddDiagramEntities }
    case REMOVE_ENTITY:
      return removeEntity(state, action.id)
    case UPDATE_ENTITY:
      const updatedDiagramEntities = new Map(state.diagramEntities)
      const newEntity = {
        ...action.entity, 
        connectionAreas: action.entity.connectionAreas.map(
          area => area.entityResizeHandler(action.entity)
        )
      }
      updatedDiagramEntities.set(action.id, newEntity)
      return { ...state, diagramEntities: updatedDiagramEntities }
    case ADD_CONNECTION:
      const newAddDiagramConnections = new Map(state.diagramConnections)
      newAddDiagramConnections.set(getNextMapId(state.diagramConnections), action.connection)
      return { ...state, diagramConnections: newAddDiagramConnections }
    case REMOVE_CONNECTION:
      const newRemoveDiagramConnections = new Map(state.diagramConnections)
      newRemoveDiagramConnections.delete(action.id)
      return { ...state, diagramConnections: newRemoveDiagramConnections }
    case UPDATE_CONNECTION:
      const updatedDiagramConnetions = new Map(state.diagramConnections)
      updatedDiagramConnetions.set(action.id, action.connection)
      return { ...state, diagramConnections: updatedDiagramConnetions }
    case SET_MOUSE_MODE:
      return { ...state, mouseMode: action.mouseMode }
    case SET_CURRENT_DIAGRAM_CONNECTION:
      return { ...state, currentDiagramConnection: action.connection }

  }

  return state
}