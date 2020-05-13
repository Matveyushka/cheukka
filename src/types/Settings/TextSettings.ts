export enum TextJustify {
  Left,
  Right,
  Center,
  Full
}

export const TextJustifySettings = {
  [TextJustify.Left]: "justifyLeft",
  [TextJustify.Right]: "justifyRight",
  [TextJustify.Center]: "justifyCenter",
  [TextJustify.Full]: "justifyFull",
}

export interface TextSettings {
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justify: TextJustify;
}