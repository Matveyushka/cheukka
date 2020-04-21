import { Store } from '../stores';
import { Action } from '../actions';
import { 
  SET_SCALE, 
  SET_XOFFSET, 
  SET_YOFFSET, 
  INCREASE_SCALE, 
  DECREASE_SCALE,

  MAX_SCALE,
  MIN_SCALE
} from '../constants';
import { getScaledOffsets } from '../utils'

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
    case SET_SCALE:
      return { ...state, prevScale: state.scale, scale: action.scale }
    case SET_XOFFSET:
      return { ...state, offsetX: action.offset }
    case SET_YOFFSET:
      return { ...state, offsetY: action.offset }
  }

  return state
}