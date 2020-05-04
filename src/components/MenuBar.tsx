import * as React from 'react'
import { DropdownMenu, DropdownMenuButton, DropdownMenuHeader, DropdownMenuDirection } from './DropdownMenu'
import { useDispatch, useSelector } from 'react-redux'
import { setSavePanelIsOpen, setTutorialIsOpen, setAboutIsOpen } from '../actions'
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
          elements={[
            new DropdownMenuButton("Undo", () => { }),
            new DropdownMenuButton("Redo", () => { }),
            new DropdownMenuButton("Copy", () => { }),
            new DropdownMenuButton("Cut", () => { }),
            new DropdownMenuButton("Paste", () => { }),
            new DropdownMenuButton("Add block", () => { }),
          ]}
        />
      </div>
      <div className='menu-item'>
        <DropdownMenu
          label="View"
          elements={[
            new DropdownMenuButton("Palette", () => { }),
            new DropdownMenuButton("Zoom", () => { }),
          ]}
        />
      </div>
      <div className='menu-item dark-button' onClick={() => dispatch(setAboutIsOpen(true))}>
        About
      </div>
      <div className='menu-free-space'>

      </div>
      <div className='menu-item menu-item-right' onClick={() => {dispatch(setTutorialIsOpen(true))}}>
        Help
      </div>
    </div>

  )
}