import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { removeEntity, removeConnection } from '../../actions'

export const useHotKeys = () => {
  const dispatch = useDispatch()

  const [
    entities,
    connections
  ] = useSelector((state: Store) => [
    state.diagramEntities,
    state.diagramConnections
  ])

  React.useEffect(() => {
    const deleteSelectedDiagrams = (event: KeyboardEvent) => {
      if (event.which === 46) {
        Array.from(entities.entries()).forEach(entry =>
          entry[1].selected ?
            dispatch(removeEntity(entry[0])) :
            null)

        Array.from(connections.entries()).forEach(entry =>
          entry[1].selected ?
            dispatch(removeConnection(entry[0])) :
            null)
      }
    }

    window.addEventListener('keydown', deleteSelectedDiagrams)

    return () => {
      window.removeEventListener('keydown', deleteSelectedDiagrams)
    }
  }, [entities])
}