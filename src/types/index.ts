export enum DiagramType {
  BlockScheme,
  ClassDiagram,
}

export enum EntityType {
  BlockSchemeAction,
  BlockSchemeCondition,
  BlockSchemeInputOutput,
  BlockSchemeBeginEnd,
  ClassDiagramClass,
  ClassDiagramInterface,
}

export interface EntityBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
}

export interface Entity {
  type: EntityType,
  x: number;
  y: number;
  width: number;
  height: number;
  blocks: Array<EntityBlock>;
  selected: boolean;
  sizeChangedOnTop: boolean;
  sizeChangedOnLeft: boolean;
  sizeChangedOnRight: boolean;
  sizeChangedOnBottom: boolean;
  moved: boolean;
  movementOriginX: number;
  movementOriginY: number;
}