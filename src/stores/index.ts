import { createStore } from 'redux'
import { mainReducer } from '../reducers'

export interface Store {
  Scale: number;
  scaleFocusX: number;
  scaleFocusY: number;
  prevScale: number;
  offsetX: number;
  offsetY: number;
}

export const store = createStore<Store, any, any, any>(mainReducer, 
  { 
    Scale: 16,
    scaleFocusX: 0,
    scaleFocusY: 0,
    prevScale: 16,
    offsetX: 0,
    offsetY: 0,
  })