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
import { DEFAULT_TEXT_SETTINGS, DEFAULT_ENTITY_SETTINGS, DEFAULT_CONNECTION_SETTINGS } from '../constants/settings'
import { EntitySettings } from '../types/Settings/EntitySettings'
import { TextSettings } from '../types/Settings/TextSettings'
import { ConnectionSettings } from '../types/Settings/ConnectionSettings'

export interface Store {
  scaleLevel: number;
  diagramType: DiagramType;
  prevScale: number;
  offsetX: number;
  offsetY: number;
  diagramEntities: Map<number, Entity>;
  diagramEntitiesHistory: Map<number, Entity>[];
  diagramConnections: Map<number, Connection>;
  diagramConnectionsHistory: Map<number, Connection>[];
  mouseMode: MouseMode;
  currentDiagramConnection: Connection | null;
  entityTypeChooserState: EntityTypeChooserState;
  connectionTypeChooserState: ConnectionTypeChooserState;
  savePanelIsOpen: boolean;
  lastSaveSettings: SaveSettings;
  isSaving: boolean;
  tutorialIsOpen: boolean;
  defaultTextSettings: TextSettings;
  textSettings: TextSettings;
  defaultEntitySettings:  EntitySettings;
  entitySettings: EntitySettings;
  defaultConnectionSettings:  ConnectionSettings;
  connectionSettings: ConnectionSettings;
  textSettingsAreOpen: boolean;
  entitySettingsAreOpen: boolean;
  connectionSettingsAreOpen: boolean;
  aboutIsOpen: boolean;
  actualVersionSaved: boolean;
}

export const store = createStore<Store, any, any, any>(mainReducer, 
  { 
    scaleLevel: START_SCALE,
    diagramType: DiagramType.BlockScheme,
    prevScale: START_SCALE,
    offsetX: 0,
    offsetY: 0,
    diagramEntities: new Map([]),
    diagramEntitiesHistory: [new Map([])],
    diagramConnections: new Map([]),
    diagramConnectionsHistory: [new Map([])],
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
    tutorialIsOpen: false,
    defaultTextSettings: DEFAULT_TEXT_SETTINGS,
    textSettings: DEFAULT_TEXT_SETTINGS,
    defaultEntitySettings: DEFAULT_ENTITY_SETTINGS,
    entitySettings: DEFAULT_ENTITY_SETTINGS,
    defaultConnectionSettings:  DEFAULT_CONNECTION_SETTINGS,
    connectionSettings: DEFAULT_CONNECTION_SETTINGS,
    textSettingsAreOpen: false,
    entitySettingsAreOpen: false,
    connectionSettingsAreOpen: false,
    aboutIsOpen: false,
    actualVersionSaved: true,
  })