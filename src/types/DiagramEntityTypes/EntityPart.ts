import { Entity } from './Entity'
import { EntityBlockSvg } from '../../svg'

export class EntityBlock {
  constructor (
    public relativeX: number,
    public relativeY: number,
    public width: number,
    public height: number,
    public svgComponent: EntityBlockSvg,
  ) { }
}

export class EntityPart {
  constructor (
    public renderer: (entity: Entity) => EntityBlock,
    public contentEditable: boolean,
    public content?: string,
  ) { }
}