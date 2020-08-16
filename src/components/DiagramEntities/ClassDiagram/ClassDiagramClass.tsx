import { Entity } from '../../../types/DiagramEntityTypes/Entity'
import { ConnectionArea, ConnectionDirection, ConnectionPoint } from '../../../types/'
import { EntityBlockRectangle } from '../../../svg/blocks'
import { EntityPart, EntityType } from '../../../types'
import { EntityBlock } from '../../../types/DiagramEntityTypes/EntityPart'
import { getScale } from '../../../utils'
import { store } from '../../../stores'
import { START_SCALE } from '../../../constants'
import { updateEntity } from '../../../actions'
import { DEFAULT_TEXT_SETTINGS } from '../../../constants/settings'
import { TextJustify } from '../../../types/Settings/TextSettings'

export class UMLClass extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(EntityType.UMLClass, x, y, width, height)

    const getBlockHeight = (entityId: number, blockIndex: number, scale: number) => {

      const defaultHeight = 5 / scale

      const block = document.getElementById(`entity ${entityId}`)?.children[blockIndex] 
      
      const contentItem = block?.children[1]

      const contentHeight = contentItem?.children[0]?.getBoundingClientRect().height / scale

      const contentEditorHeight = contentItem?.children[1]?.getBoundingClientRect().height / scale

      if (!contentHeight && !contentEditorHeight) {
        return defaultHeight + 1
      } else if (!contentEditorHeight || contentEditorHeight < contentHeight) {
        return (contentHeight ?? defaultHeight) + 1
      } else {
        return (contentEditorHeight ?? defaultHeight) + 1
      }
    }

    this.parts = [
      new EntityPart((entity: Entity, entityId: number, scale: number) => new EntityBlock(
        0, 
        getBlockHeight(entityId, 2, scale),
        entity.width, 
        getBlockHeight(entityId, 0, scale),
        EntityBlockRectangle
      ), true, 'Class fileds', { justify: TextJustify.Left }),
      new EntityPart((entity: Entity, entityId: number, scale: number) => new EntityBlock(
        0, 
        getBlockHeight(entityId, 0, scale) + getBlockHeight(entityId, 2, scale),
        entity.width, 
        getBlockHeight(entityId, 1, scale),
        EntityBlockRectangle
      ), true, 'Class methods', { justify: TextJustify.Left }),
      new EntityPart((entity: Entity, entityId: number, scale: number) => new EntityBlock(
        0,
        0,
        entity.width,
        getBlockHeight(entityId, 2, scale),
        EntityBlockRectangle
      ), true, 'Class name', { bold: true }),
    ]

    this.connectionAreaCreators = [
      (entity: Entity) => new ConnectionArea(0, 0, entity.width, 0, [ConnectionDirection.Top]),
      (entity: Entity) => new ConnectionArea(entity.width, 0, entity.width, entity.height, [ConnectionDirection.Right]),
      (entity: Entity) => new ConnectionArea(entity.width, entity.height, 0, entity.height, [ConnectionDirection.Bottom]),
      (entity: Entity) => new ConnectionArea(0, 0, 0, entity.height, [ConnectionDirection.Left]),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, 0, [ConnectionDirection.Top], true),
      (entity: Entity) => new ConnectionPoint(entity.width, entity.height / 2, [ConnectionDirection.Right], true),
      (entity: Entity) => new ConnectionPoint(entity.width / 2, entity.height, [ConnectionDirection.Bottom], true),
      (entity: Entity) => new ConnectionPoint(0, entity.height / 2, [ConnectionDirection.Left], true),
    ]

    this.heightToContentAdapter = (entityId, scale) => 
      getBlockHeight(entityId, 0, scale) + 
      getBlockHeight(entityId, 1, scale) + 
      getBlockHeight(entityId, 2, scale)
  }
}