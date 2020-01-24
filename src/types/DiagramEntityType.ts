import { Entity } from './Entity'
import { ComponentDiagramModule } from '../components/DiagramEntities/ComponentDiagram/ComponentDiagramModule'
import { BlockSchemeAction } from '../components/DiagramEntities/BlockScheme/BlockSchemeAction'
import { BlockSchemeCondition } from '../components/DiagramEntities/BlockScheme/BlockSchemeCondition'
import { DiagramType } from './DiagramType'

export enum DiagramEntityType {
  ComponentModule,
  BlockSchemeAction,
  BlockSchemeCondition,
}

export const diagramEntityGroups = new Map<DiagramType, { name: string, types: Array<DiagramEntityType> }>([
  [DiagramType.BlockScheme, {name: 'Block scheme', types: [DiagramEntityType.BlockSchemeAction, DiagramEntityType.BlockSchemeCondition]}],
  [DiagramType.UMLComponent, {name: 'Component diagram', types: [DiagramEntityType.ComponentModule]}],
])

export const diagramEntityCreators = new Map<
  DiagramEntityType, 
  {
    name: string,
    create: (x: number, y: number, width: number, height: number) => Entity
  }>([
    [
      DiagramEntityType.ComponentModule, 
      {
        name: 'Module',
        create: (x: number, y: number, width: number, height: number) => new ComponentDiagramModule(x,y,width, height)
      } 
    ],
    [
      DiagramEntityType.BlockSchemeAction, 
      {
        name: 'Action',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeAction(x,y,width, height)
      } 
    ],
    [
      DiagramEntityType.BlockSchemeCondition, 
      {
        name: 'Condition',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeCondition(x,y,width, height)
      } 
    ],
  ]) 
