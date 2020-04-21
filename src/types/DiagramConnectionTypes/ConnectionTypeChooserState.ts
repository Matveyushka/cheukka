import { ConnectionPathPoint } from './ConnectionPathPoint/'

export interface ConnectionTypeChooserState {
  isActive: boolean;
  x: number;
  y: number;
  endPoint: ConnectionPathPoint | null
}

export const nonActiveConnectionTypeChooserState : ConnectionTypeChooserState = {
  isActive: false,
  x: 0,
  y: 0,
  endPoint: null,
}