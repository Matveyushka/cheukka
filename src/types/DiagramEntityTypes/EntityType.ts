import { Entity } from './Entity'
import { ComponentDiagramModule } from '../../components/DiagramEntities/ComponentDiagram/ComponentDiagramModule'
import { BlockSchemeAction } from '../../components/DiagramEntities/BlockScheme/BlockSchemeAction'
import { BlockSchemeCondition } from '../../components/DiagramEntities/BlockScheme/BlockSchemeCondition'
import { DiagramType } from '../DiagramType'

export enum EntityType {
  ComponentModule,
  BlockSchemeAction,
  BlockSchemeCondition,
}

export const entityGroups = new Map<DiagramType, { name: string, types: Array<EntityType> }>([
  [DiagramType.BlockScheme, {name: 'Block scheme', types: [EntityType.BlockSchemeAction, EntityType.BlockSchemeCondition]}],
  [DiagramType.UMLComponent, {name: 'Component diagram', types: [EntityType.ComponentModule]}],
])

export const entityCreators = new Map<
  EntityType, 
  {
    name: string,
    create: (x: number, y: number, width: number, height: number) => Entity
  }>([
    [
      EntityType.ComponentModule, 
      {
        name: 'Module',
        create: (x: number, y: number, width: number, height: number) => new ComponentDiagramModule(x,y,width, height)
      } 
    ],
    [
      EntityType.BlockSchemeAction, 
      {
        name: 'Action',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeAction(x,y,width, height)
      } 
    ],
    [
      EntityType.BlockSchemeCondition, 
      {
        name: 'Condition',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeCondition(x,y,width, height)
      } 
    ],
  ]) 
