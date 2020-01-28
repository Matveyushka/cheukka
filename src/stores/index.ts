import { createStore } from 'redux'
import { mainReducer } from '../reducers'
import { START_SCALE } from '../constants' 
import { 
  Entity, Connection, MouseMode,
  DiagramEntityTypeChooserState,
  ConnectionTypeChooserState,
  DiagramType, 
  nonActiveConnectionTypeChooserState} from '../types'

export interface Store {
  scaleLevel: number;
  diagramType: DiagramType;
  prevScale: number;
  offsetX: number;
  offsetY: number;
  diagramEntities: Map<number, Entity>;
  diagramConnections: Map<number, Connection>;
  mouseMode: MouseMode;
  currentDiagramConnection: Connection | null;
  diagramEntityTypeChooserState: DiagramEntityTypeChooserState;
  connectionTypeChooserState: ConnectionTypeChooserState;
}

export const store = createStore<Store, any, any, any>(mainReducer, 
  { 
    scaleLevel: START_SCALE,
    diagramType: DiagramType.BlockScheme,
    prevScale: START_SCALE,
    offsetX: 0,
    offsetY: 0,
    diagramEntities: new Map([]),
    diagramConnections: new Map([]),
    mouseMode: MouseMode.default,
    currentDiagramConnection: null,
    diagramEntityTypeChooserState: {
      isActive: false,
      x: 0,
      y: 0,
    },
    connectionTypeChooserState: nonActiveConnectionTypeChooserState
  })