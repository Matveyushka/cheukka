import { createStore } from 'redux'
import { mainReducer } from '../reducers'

export interface Store {
  scale: number;
  xOffset: number;
  yOffset: number;
}

export const store = createStore<Store, any, any, any>(mainReducer, 
  { 
    scale: 100,
    xOffset: 0,
    yOffset: 0,
  })