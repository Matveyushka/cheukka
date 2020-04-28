import { EntitySettings } from '../types/Settings/EntitySettings'
import { TextSettings } from '../types/Settings/TextSettings'
import { ConnectionSettings } from '../types/Settings/ConnectionSettings'

export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  fontSize: 14,
  fontFamily: "Calibri",
  color: "#000000",
  bold: false,
  italic: false,
  underline: false,
}

export const DEFAULT_ENTITY_SETTINGS: EntitySettings = {
  thickness: 1,
  borderColor: "#000000",
  backgroundColor: "#ffffff",
}

export const DEFAULT_CONNECTION_SETTINGS: ConnectionSettings = {
  thickness: 1,
  arrowSize: 1,
  color: "#000000",
}