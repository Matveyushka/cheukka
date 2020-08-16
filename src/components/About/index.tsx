import * as React from 'react'
import { useDispatch } from 'react-redux'
import { setAboutIsOpen } from '../../actions'

interface AboutProps {

}

export const About = (props: AboutProps) => {
  const dispatch = useDispatch()

  return (
    <div className='about-page'>
      <div className='about-page-head'>
        <div className='about-page-head-description'>
          Cheukka
        </div>
        <div 
        className='about-page-exit dark-button'
        onClick={() => dispatch(setAboutIsOpen(false))}
        >
          X
        </div>
      </div>
      <div className='about-page-body'>
        Made by Vasilev Matvey, 2020.
      </div>
    </div>
  )
}