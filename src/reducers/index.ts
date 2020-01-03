import { Store } from '../stores';
import { Action } from '../actions';
import { 
  SET_SCALE, 
  SET_SCALE_FOCUS_X,
  SET_SCALE_FOCUS_Y,
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
        action.Scale,
        state.Scale)

      return { ...state, prevScale: +state.Scale, Scale: +action.Scale, offsetX: _offsetX, offsetY: _offsetY }
    case INCREASE_SCALE:
      if (state.Scale + action.Scale <= MAX_SCALE) {
        const { _offsetX, _offsetY} = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.Scale + action.Scale,
          state.Scale)

        return { ...state, prevScale: +state.Scale, Scale: +state.Scale + action.Scale, offsetX: _offsetX, offsetY: _offsetY }
      }
      return state
    case DECREASE_SCALE:
      if (state.Scale - action.Scale >= MIN_SCALE) { 
        const { _offsetX, _offsetY} = getScaledOffsets(
          state.offsetX,
          state.offsetY,
          action.scaleFocusX,
          action.scaleFocusY,
          state.Scale - action.Scale,
          state.Scale)

        return { ...state, prevScale: +state.Scale,  Scale: +state.Scale - action.Scale, offsetX: _offsetX, offsetY: _offsetY }
      }
      return state
    case SET_SCALE:
      return { ...state, prevScale: state.Scale, Scale: action.Scale }
    case SET_XOFFSET:
      return { ...state, offsetX: action.offset }
    case SET_YOFFSET:
      return { ...state, offsetY: action.offset }
  }

  return state
}