import { Entity } from './Entity'

export interface EntityPart {
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  entityResizeHandler: (entity: Entity) => EntityPart;
  render: (entity: Entity) => React.ReactElement;
}