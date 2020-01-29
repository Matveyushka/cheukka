import * as React from 'react'

export type connectionEndSvgCreator = (x: number, y: number, scale: number) => React.ReactElement

export const getConnectingArrow: connectionEndSvgCreator = (x: number, y: number, scale: number) => {
  return (<path
    d={`M ${x * scale} ${y * scale}
        L ${x * scale + 5} ${y * scale + 8}
        L ${x * scale} ${y * scale + 5}
        L ${x * scale - 5} ${y * scale + 8}`}
    fill='black'
  />)
}

export const getBlockSchemeArrow: connectionEndSvgCreator = (x: number, y: number, scale: number) => {
  return (<path
    d={`M ${x * scale} ${y * scale}
        L ${x * scale + 5} ${y * scale + 8}
        L ${x * scale - 5} ${y * scale + 8}`}
    fill='black'
  />)
}


