import { Store } from '../stores';
import { Action } from '../actions';
import { 
  SET_SCALE, 
  SET_XOFFSET, 
  SET_YOFFSET, 
  INCREASE_SCALE, 
  DECREASE_SCALE 
} from '../constants';

export const mainReducer = (state: Store, action: Action) : Store => {
  
  switch (action.type) {
    case SET_SCALE:
      return { ...state, scale: action.scale }
    case INCREASE_SCALE:
      if (state.scale + action.scale <= 200) {
        return { ...state, scale: state.scale + action.scale }
      }
      return state
    case DECREASE_SCALE:
      if (state.scale - action.scale >= 0) { 
        return { ...state, scale: state.scale - action.scale }
      }
      return state
    case SET_XOFFSET:
      return { ...state, xOffset: action.offset }
    case SET_YOFFSET:
      return { ...state, yOffset: action.offset }
  }

  return state
}