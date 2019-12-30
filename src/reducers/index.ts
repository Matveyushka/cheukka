import { Store } from '../stores';
import { Action } from '../actions';
import { 
  SET_SCALE, 
  SET_SCALE_FOCUS_X,
  SET_SCALE_FOCUS_Y,
  SET_XOFFSET, 
  SET_YOFFSET, 
  INCREASE_SCALE, 
  DECREASE_SCALE 
} from '../constants';

export const mainReducer = (state: Store, action: Action) : Store => {
  
  switch (action.type) {
    case SET_SCALE:
      return { ...state, prevScale: state.scale, scale: action.scale }
    case INCREASE_SCALE:
      if (state.scale + action.scale <= 200) {
        return { ...state, prevScale: state.scale,  scale: state.scale + action.scale }
      }
      return state
    case DECREASE_SCALE:
      if (state.scale - action.scale >= 0) { 
        return { ...state, prevScale: state.scale,  scale: state.scale - action.scale }
      }
      return state
    case SET_SCALE:
      return { ...state, prevScale: state.scale, scale: action.scale }
    case SET_XOFFSET:
      return { ...state, xOffset: action.offset }
    case SET_YOFFSET:
      return { ...state, yOffset: action.offset }
  }

  return state
}