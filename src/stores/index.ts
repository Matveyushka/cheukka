import { createStore } from 'redux'
import { mainReducer } from '../reducers'
import { START_SCALE } from '../constants' 

export interface Store {
  scale: number;
  diagramType: string;
  prevScale: number;
  offsetX: number;
  offsetY: number;
}

export const store = createStore<Store, any, any, any>(mainReducer, 
  { 
    scale: START_SCALE,
    diagramType: 'Class diagram',
    prevScale: START_SCALE,
    offsetX: 0,
    offsetY: 0,
  })