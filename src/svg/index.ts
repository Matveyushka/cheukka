export const getBackgroundSvgImage = (svg: string) => `url('data:image/svg+xml;base64,${svg}')`

export const getSvgExit = (scale: number, color: string) => {
  const strokeWidthMultiplier = scale

  return window.btoa(`<svg width='10' height='10' xmlns='http://www.w3.org/2000/svg'>
    <rect width='10' height='10' fill='white'/>
    <line x1='0' y1='0' x2='10' y2='10' stroke='${color}' stroke-width='1.2' />
    <line x1='10' y1='0' x2='0' y2='10' stroke='${color}' stroke-width='1.2' />
  </svg>`)
}