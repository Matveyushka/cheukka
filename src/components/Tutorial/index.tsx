import * as React from 'react'
import { useDispatch } from 'react-redux'
import { setTutorialIsOpen } from '../../actions'
import tutorialStructure from '../../../assets/tutorial/structure.json'
import { NavFragment } from './NavFragment'

interface TutorialProps {

}

export const Tutorial = (props: TutorialProps) => {
  const dispatch = useDispatch()
  
  const bodyRef = React.useRef(null)

  const openPage = (content: string) => {
    fetch(`/assets/tutorial/pages/${content}.html`).then(response => {
      response.text().then(text => bodyRef.current.innerHTML = text)
    })
  }

  const navigationMenu = tutorialStructure.map((navigationFragment, index) => (
    <NavFragment
      key={index}
      navigationFragment={navigationFragment}
      openPage={openPage}
    />
  ))

  React.useEffect(() => {
    openPage("introduction")
  }, [])

  return (
    <div className='tutorial'>
      <div className='tutorial-header'>
        <div className='tutorial-header-label'>tutorial</div>
        <div className='tutorial-header-button' onClick={() => dispatch(setTutorialIsOpen(false))}>X</div>
      </div>
      <div className='tutorial-navigation'>
        {navigationMenu}
      </div>
      <div className='tutorial-body' ref={bodyRef}></div>
    </div>
  )
}