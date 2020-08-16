import * as React from 'react'
import { MenuBar } from './MenuBar'
import { Workspace } from './Workspace'
import { StatusBar } from './StatusBar'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { SavePanel } from './SavePanel'
import { Tutorial } from './Tutorial'
import { About } from './About'
import { useRecoveryDispather } from '../hooks/recoveryDispatherHook'

export interface MainProps { }

export const Main = (props: MainProps) : React.ReactElement => {
  const [
    savePanelIsOpen,
    tutorialIsOpen,
    aboutIsOpen
  ] = useSelector((state: Store) => [
    state.savePanelIsOpen,
    state.tutorialIsOpen,
    state.aboutIsOpen
  ])

  useRecoveryDispather()

  return (
    <div className='main'>
      <MenuBar />
      <Workspace />
      <StatusBar />
      {savePanelIsOpen && <SavePanel/>}
      {tutorialIsOpen && <Tutorial/>}
      {aboutIsOpen && <About/>}
    </div>
  )
}