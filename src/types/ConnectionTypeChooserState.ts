import { ConnectionPoint } from './ConnectionPoint/'

export interface ConnectionTypeChooserState {
  isActive: boolean;
  x: number;
  y: number;
  endPoint: ConnectionPoint | null
}

export const nonActiveConnectionTypeChooserState : ConnectionTypeChooserState = {
  isActive: false,
  x: 0,
  y: 0,
  endPoint: null,
}