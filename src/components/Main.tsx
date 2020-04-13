import * as React from 'react'

import { MenuBar } from './MenuBar'
import { Workspace } from './Workspace'
import { StatusBar } from './StatusBar'

import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { SavePanel } from './SavePanel'

export interface MainProps {

}

export const Main = (props: MainProps) : React.ReactElement => {
  const savePanelIsOpen = useSelector((state: Store) => state.savePanelIsOpen)

  return (
    <div className='main'>
      <MenuBar />
      <Workspace />
      <StatusBar />
      {savePanelIsOpen ? <SavePanel/> : ""}
    </div>
  )
}