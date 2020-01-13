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
} from '../constants/actions'
import { 
  MAX_SCALE,
  MIN_SCALE,  
} from '../constants';
import { getScaledOffsets } from '../utils'

const getNextDiagramId = (diagramEntities: Map<number, any>) => diagramEntities.size === 0 ?
  0 :
  Math.max(...Array.from(diagramEntities.keys())) + 1

export const mainReducer = (state: Store, action: Action) : Store => {
  
  switch (action.type) {
    case SET_SCALE:
      const { _offsetX, _offsetY} = getScaledOffsets(
        state.offsetX,
        state.offsetY,
        action.scaleFocusX,
        action.scaleFocusY,
        action.scale,
        state.scale)
      
      return { ...state, prevScale: +state.scale, scale: +action.scale, offsetX: _offsetX, offsetY: _offsetY }
    case INCREASE_SCALE:
      if (state.scale + action.scale <= MAX_SCALE) {
        const { _offsetX, _offsetY} = getScaledOffsets(
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
        const { _offsetX, _offsetY} = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.scale - action.scale,
          state.scale)

        return { ...state, prevScale: +state.scale,  scale: +state.scale - action.scale, offsetX: _offsetX, offsetY: _offsetY }
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
      newAddDiagramEntities.set(getNextDiagramId(state.diagramEntities), action.entity)
      return { ...state, diagramEntities: newAddDiagramEntities }
    case REMOVE_ENTITY:
      const newRemoveDiagramEntities = new Map(state.diagramEntities)
      newRemoveDiagramEntities.delete(action.id)
      return { ...state, diagramEntities: newRemoveDiagramEntities }
    case UPDATE_ENTITY:
      const updatedDiagramEntities = new Map(state.diagramEntities)
      updatedDiagramEntities.set(action.id, action.entity)
      return { ...state, diagramEntities: updatedDiagramEntities }
  }

  return state
}