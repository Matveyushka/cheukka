export class PngSaveSettings {
  constructor(
    public name: string,
    public scale: number,
    public background: boolean
  ) { }
}

export class SvgSaveSettings {
  constructor(
    public name: string
  ) { }
}

export class HtmlSaveSettings {
  constructor(
    public name: string
  ) { }
}

export class ChkSaveSettings {
  constructor(
    public name: string
  ) { }
}

export type SaveSettings = PngSaveSettings | SvgSaveSettings | HtmlSaveSettings | ChkSaveSettings | null