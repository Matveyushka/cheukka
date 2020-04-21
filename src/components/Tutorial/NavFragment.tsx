import * as React from 'react'

interface NavigationFragment {
  name: string;
  content?: string;
  subfragments?: NavigationFragment[];
}

interface NavFragmentProps {
  navigationFragment: NavigationFragment;
  openPage: (content: string) => void
}

export const NavFragment = (props: NavFragmentProps) => {
  if (props.navigationFragment.content) {
    return (
      <div className='tutorial-navigation-page tutorial-navigation-element'
        onClick={() => props.openPage(props.navigationFragment.content)}>
        {props.navigationFragment.name}
      </div>
    )
  } else if (props.navigationFragment.subfragments) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false)

    return (
      <div className='tutorial-navigation-category'>
        <div className='tutorial-navigation-category-header tutorial-navigation-element' onClick={() => setIsOpen(!isOpen)}>
          {`${isOpen ? "-" : "+"} ${props.navigationFragment.name}`}
        </div>
        <div className={`tutorial-navigation-category-body ${isOpen ? "" : "tutorial-invisible"}`}>
          {
            props.navigationFragment.subfragments.map((subFragment, index) => (
              <NavFragment
                key={index}
                navigationFragment={subFragment}
                openPage={props.openPage}
              />
            ))
          }
        </div>
      </div>
    )
  }
}