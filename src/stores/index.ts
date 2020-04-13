import { createStore } from 'redux'
import { mainReducer } from '../reducers'
import { START_SCALE } from '../constants' 
import { 
  Entity, Connection, MouseMode,
  EntityTypeChooserState,
  ConnectionTypeChooserState,
  DiagramType, 
  nonActiveConnectionTypeChooserState} from '../types'
import { SaveSettings } from '../types/SaveSettings'

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
  entityTypeChooserState: EntityTypeChooserState;
  connectionTypeChooserState: ConnectionTypeChooserState;
  savePanelIsOpen: boolean;
  lastSaveSettings: SaveSettings;
  isSaving: boolean;
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
    entityTypeChooserState: {
      isActive: false,
      x: 0,
      y: 0,
      withConnecting: false,
      diagramEntityTypes: [],
    },
    connectionTypeChooserState: nonActiveConnectionTypeChooserState,
    savePanelIsOpen: false,
    lastSaveSettings: null,
    isSaving: false,
  })