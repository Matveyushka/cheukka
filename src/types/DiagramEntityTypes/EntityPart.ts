import { Entity } from './Entity'
import { EntityBlockSvg } from '../../svg/blocks'
import { TextSettings, TextJustify } from '../Settings/TextSettings'
import { store } from '../../stores/index' 

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
    renderer: (entity: Entity, entityId?: number, scale?: number) => EntityBlock,
    contentEditable: boolean,
    content?: string,
    defaultTextSettings?: Partial<TextSettings>
  ) { 
    const settings = { ...store.getState().defaultTextSettings, ...defaultTextSettings }
    let thisContent = content
    if (settings.underline) {
      thisContent = `<u>${thisContent}</u>`
    }
    if (settings.italic) {
      thisContent = `<i>${thisContent}</i>`
    }
    if (settings.bold) {
      thisContent = `<b>${thisContent}</b>`
    }
    thisContent = `<font style="font-size: ${settings.fontSize}px;" color="${settings.color}" face="${settings.fontFamily}">${thisContent}</font>`

    thisContent = `<div style="text-align: ${
      settings.justify === TextJustify.Right ? "right" :
      settings.justify === TextJustify.Center ? "center" :
      settings.justify === TextJustify.Full ? "justify" : "left"
    }">${thisContent}</div>`

    this.renderer = renderer
    this.content = thisContent
    this.contentEditable = contentEditable
    this.defaultTextSettings = defaultTextSettings
  }
  renderer: (entity: Entity, entityId?: number, scale?: number) => EntityBlock
  contentEditable: boolean
  content?: string
  defaultTextSettings?: Partial<TextSettings>
}

/*
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justify: TextJustify;
*/