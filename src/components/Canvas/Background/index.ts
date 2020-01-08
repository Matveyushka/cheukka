/*const getBackgroundSvg = (scale: number) => {
  const size = DEFAULT_CANVAS_WIDTH / 10
  return window.btoa(`<svg width='${size}' height='${size}' xmlns='http://www.w3.org/2000/svg'>
  <defs>
     <pattern id='smallGrid' width='${size / 10}' height='${size / 10}' patternUnits='userSpaceOnUse'>
       <path d='M ${size / 10} 0 L 0 0 0 ${size / 10}' fill='none' stroke='gray' stroke-width='${1 / getScale(scale)}'/>
     </pattern>
     <pattern id='grid' width='${size}' height='${size}' patternUnits='userSpaceOnUse'>
       <rect width='${size}' height='${size}' fill='url(#smallGrid)'/>
       <path d='M ${size} 0 L 0 0 0 ${size}' fill='none' stroke='gray' stroke-width='${1 / getScale(scale)}'/>
     </pattern>
   </defs>
   <rect width='${size}' height='${size}' fill='url(#grid)' />
  </svg>`)
  //          backgroundImage: `url('data:image/svg+xml;base64,${getBackgroundSvg(scale)}')`,
  //        backgroundSize: 'contain / 100',
}*/