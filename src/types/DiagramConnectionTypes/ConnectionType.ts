export enum ConnectionType {
  Connecting,
  Default,
  BlockSchemeArrow,
  Association,
  Inheritance,
  Implementation,
  Dependency,
  Aggregation,
  Composition
}

export const allConnectionTypes = [
  ConnectionType.Default,
  ConnectionType.BlockSchemeArrow,
  ConnectionType.Aggregation,
  ConnectionType.Association,
  ConnectionType.Composition,
  ConnectionType.Dependency,
  ConnectionType.Implementation,
  ConnectionType.Inheritance
]