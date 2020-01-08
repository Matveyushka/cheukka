import { getScale } from '../../../utils'

export const getBackgroundSvg = (scale: number, backgroundBlocksAmountInWidth: number) => {
  const strokeWidthMultiplier = 1 / getScale(scale) / (10 / backgroundBlocksAmountInWidth)

  return window.btoa(`<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'>
  <defs>
     <pattern id='smallGrid' width='10' height='10' patternUnits='userSpaceOnUse'>
       <path d='M 10 0 L 0 0 0 10' fill='none' stroke='gray' stroke-width='${1 * strokeWidthMultiplier}'/>
     </pattern>
     <pattern id='grid' width='100' height='100' patternUnits='userSpaceOnUse'>
       <rect width='100' height='100' fill='url(#smallGrid)'/>
       <path d='M 100 0 L 0 0 0 100' fill='none' stroke='gray' stroke-width='${2 * strokeWidthMultiplier}'/>
     </pattern>
   </defs>
   <rect width='100' height='100' fill='url(#grid)' />
  </svg>`)
}