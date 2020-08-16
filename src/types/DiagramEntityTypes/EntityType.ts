import { Entity } from './Entity'
import { ComponentDiagramModule } from '../../components/DiagramEntities/ComponentDiagram/ComponentDiagramModule'
import { BlockSchemeAction } from '../../components/DiagramEntities/BlockScheme/BlockSchemeAction'
import { BlockSchemeCondition } from '../../components/DiagramEntities/BlockScheme/BlockSchemeCondition'
import { DiagramType } from '../DiagramType'
import { BlockSchemeData } from '../../components/DiagramEntities/BlockScheme/BlockSchemeData'
import { BlockSchemeTerminal } from '../../components/DiagramEntities/BlockScheme/BlockSchemeTerminal'
import { BlockSchemeProcess } from '../../components/DiagramEntities/BlockScheme/BlockSchemeProcess'
import { UMLClass } from '../../components/DiagramEntities/ClassDiagram/ClassDiagramClass'

export enum EntityType {
  ComponentModule,
  BlockSchemeAction,
  BlockSchemeCondition,
  BlockSchemeData,
  BlockSchemeTerminal,
  BlockSchemeProcess,
  UMLClass,
}

export const entityGroups = new Map<DiagramType, { name: string, types: Array<EntityType> }>([
  [DiagramType.BlockScheme, {name: 'Block scheme', types: [
    EntityType.BlockSchemeAction,
    EntityType.BlockSchemeCondition,
    EntityType.BlockSchemeData,
    EntityType.BlockSchemeTerminal,
    EntityType.BlockSchemeProcess,
  ]}],
  [DiagramType.UMLComponent, {name: 'Component diagram', types: [EntityType.ComponentModule]}],
  [DiagramType.UMLClass, { name: 'Class diagram', types: [EntityType.UMLClass]}],
  [DiagramType.UMLActivity, { name: 'Activity diagram', types: []}],
  [DiagramType.UMLState, { name: 'State diagram', types: []}],
  [DiagramType.UMLSequence, { name: 'Sequence diagram', types: []}],
  [DiagramType.DFD, { name: 'Data flow diagram', types: []}],
  [DiagramType.IDEF0, { name: 'IDEF0', types: []}],
  [DiagramType.IDEF3, { name: 'IDEF3', types: []}]
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
    [
      EntityType.BlockSchemeData, 
      {
        name: 'Data',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeData(x,y,width, height)
      } 
    ],
    [
      EntityType.BlockSchemeTerminal, 
      {
        name: 'Terminal',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeTerminal(x,y,width, height)
      } 
    ],
    [
      EntityType.BlockSchemeProcess, 
      {
        name: 'Process',
        create: (x: number, y: number, width: number, height: number) => new BlockSchemeProcess(x,y,width, height)
      } 
    ],
    [
      EntityType.UMLClass, 
      {
        name: 'Class',
        create: (x: number, y: number, width: number, height: number) => new UMLClass(x,y,width, height)
      } 
    ],
  ]) 
