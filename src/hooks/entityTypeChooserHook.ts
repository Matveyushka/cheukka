import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { setEntityTypeChooserState } from '../actions'
import { entityGroups } from '../types/DiagramEntityTypes/EntityType'
import { ConnectionAreaPoint, EntityConnectionPoint, allConnectionTypes } from '../types'
import { validEntityConnectionsBegin, validEntityConnectionsEnd } from '../constants/dictionaries/validEntityConnections'
import { useCurrentDiagramConnectionController } from './currentDiagramConnectionHook'

export const useEntityTypeChooserController = () => {
  const [entityTypeChooserState, diagramType, entities] = useSelector((state: Store) => [
    state.entityTypeChooserState,
    state.diagramType,
    state.diagramEntities
  ])

  const dispatch = useDispatch()

  const currentConnectionController = useCurrentDiagramConnectionController()

  const possibleEnds = (() => {
    const begin = currentConnectionController.getBegin()

    const possibleConnections = (() => {
      if (begin instanceof ConnectionAreaPoint ||
        begin instanceof EntityConnectionPoint) {
        return validEntityConnectionsBegin.get(entities.get(begin.entityId).type)
      } else {
        return allConnectionTypes
      }
    })()

    console.log(possibleConnections)
    
    return Array.from(Array.from(validEntityConnectionsEnd.entries()).filter(rule =>
      rule[1].filter(type => possibleConnections.indexOf(type) >= 0).length > 0
    ).map(rule => rule[0]))
  })

  const deactivate = () => {
    dispatch(setEntityTypeChooserState({ ...entityTypeChooserState, isActive: false }))
  }

  const activate = (x: number, y: number, withConnecting: boolean) => {
    if (withConnecting) {
      dispatch(setEntityTypeChooserState({
        isActive: true,
        x,
        y,
        withConnecting: true,
        diagramEntityTypes: possibleEnds(),
      }))
    } else {
      dispatch(setEntityTypeChooserState({
        isActive: true,
        x,
        y,
        withConnecting: false,
        diagramEntityTypes: entityGroups.get(diagramType).types,
      }))
    }
  }

  return {
    deactivate,
    activate
  }
}