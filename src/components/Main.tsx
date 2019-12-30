import * as React from 'react'

import { MenuBar } from './MenuBar'
import { Workspace } from './Workspace'
import { StatusBar } from './StatusBar'

export interface MainProps {

}

export const Main = (props: MainProps) : React.ReactElement => {
  return (
    <div className="main">
      <MenuBar />
      <Workspace />
      <StatusBar />
    </div>
  )
}