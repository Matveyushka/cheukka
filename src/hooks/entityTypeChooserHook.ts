import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { setEntityTypeChooserState } from '../actions'

export const useEntityTypeChooserController = () => {
  const entityTypeChooserState = useSelector((state: Store) => state.entityTypeChooserState)

  const dispatch = useDispatch()

  const deactivate = () => {
    dispatch(setEntityTypeChooserState({ ...entityTypeChooserState,isActive: false }))
  }

  const activate = (x: number, y: number, withConnecting: boolean) => {
    dispatch(setEntityTypeChooserState({ isActive: true, x, y, withConnecting }))
  }

  return {
    deactivate,
    activate
  }
}