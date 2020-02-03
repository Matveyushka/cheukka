import * as React from 'react'

export interface MenuBarProps {

}

export const MenuBar =  (props: MenuBarProps) => {
  return (
  <div className='menu-bar'>
    <button className='menu-bar-button'>File</button>
    <button className='menu-bar-button'>Edit</button>
    <button className='menu-bar-button'>View</button>
    <button className='menu-bar-button'>Help</button>
    <button className='menu-bar-button'>About</button>
  </div>
  
  )
}