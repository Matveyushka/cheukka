import { EntityType } from './EntityType'

export interface EntityTypeChooserState {
  isActive: boolean;
  x: number;
  y: number;
  withConnecting: boolean;
  diagramEntityTypes: Array<EntityType>;
}