export const vwToPx = (vw: number) => {
  return vw * (window.innerWidth / 100)
}

export const pxToVw = (px: number) => {
  return px / (window.innerWidth / 100)
}

export const vhToPx = (vh: number) => {
  return vh * (window.innerHeight / 100)
}

export const pxToVh = (px: number) => {
  return px / (window.innerHeight / 100)
}