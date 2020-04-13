import * as React from 'react'
import { DropdownMenu, DropdownMenuButton, DropdownMenuHeader, DropdownMenuDirection } from './DropdownMenu'
import { useDispatch, useSelector } from 'react-redux'
import { setSavePanelIsOpen } from '../actions'
import { useFileSaveHook } from '../hooks/fileSaverHook'
import { Store } from '../stores'

export interface MenuBarProps {

}

export const MenuBar = (props: MenuBarProps) => {
  const dispatch = useDispatch()
  const lastSaveSettings = useSelector((state: Store) => state.lastSaveSettings)

  const { saveAgain } = useFileSaveHook()

  return (
    <div className='menu-bar'>
      <div className='menu-item'>
        <DropdownMenu
          label="File"
          elements={[
            new DropdownMenuButton("New", () => { }),
            new DropdownMenuButton("Open", () => { }),
            new DropdownMenuButton("Save as", () => dispatch(setSavePanelIsOpen(true))),
            new DropdownMenuButton("Save", saveAgain, () => lastSaveSettings !== null),
            new DropdownMenuButton("Exit", () => { }),
          ]}
        />
      </div>
      <div className='menu-item'>
        <DropdownMenu
          label="Edit"
          elements={[]}
        />
      </div>
      <div className='menu-item'>
        <DropdownMenu
          label="View"
          elements={[]}
        />
      </div>
      <div className='menu-item'>
        <DropdownMenu
          label="Help"
          elements={[]}
        />
      </div>
      <div className='menu-item'>
        <DropdownMenu
          label="About"
          elements={[]}
        />
      </div>
    </div>

  )
}