import { Entity } from './Entity'
import { EntityBlockSvg } from '../svg'

export class EntityBlock {
  constructor (
    relativeX: number,
    relativeY: number,
    width: number,
    height: number,
    svgComponent: EntityBlockSvg,
  ) {
    this.relativeX = relativeX
    this.relativeY = relativeY
    this.width = width
    this.height = height
    this.svgComponent = svgComponent
  }

  relativeX: number
  relativeY: number
  width: number
  height: number
  svgComponent: EntityBlockSvg
}

export class EntityPart {
  constructor (
    renderer: (entity: Entity) => EntityBlock,
    contentEditable: boolean,
    content?: string,
  ) {
    this.renderer = renderer
    this.contentEditable = contentEditable
    this.content = content
  }

  renderer: (entity: Entity) => EntityBlock

  contentEditable: boolean
  content?: string
}