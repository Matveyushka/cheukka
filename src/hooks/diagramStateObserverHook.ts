import { useSelector, useDispatch } from "react-redux"
import { Store } from "../stores"
import React from "react"
import { Entity } from "../types"
import { areEntitiesEqual } from "../types/DiagramEntityTypes/Entity"
import { addDiagramEntitiesStamp } from "../actions"

export const useDiagramStateObserver = () => {
  const dispatch = useDispatch()

  const [
    entities,
    connections,
    entitiesHistory,
  ] = useSelector((state: Store) => [
    state.diagramEntities,
    state.diagramConnections,
    state.diagramEntitiesHistory
  ])

  const areEntityMapsEqual = (entities1: Map<number, Entity>, entities2: Map<number, Entity>) => {
    if (entities1.size !== entities2.size) {
      return false
    }
    for (var [key, entity1] of entities1) {
      if (!entities2.has(key)) {
        return false
      }
      const entity2 = entities2.get(key)
      if (!areEntitiesEqual(entity1, entity2)) {
        return false
      }
    }
    return true
  }

  
  React.useEffect(() => {
    if (Array.from(entities.values()).filter(entity => (
      entity.moved || 
      entity.sizeChangedOnBottom ||
      entity.sizeChangedOnLeft ||
      entity.sizeChangedOnRight ||
      entity.sizeChangedOnTop
      )).length === 0
    ) {
      if (!areEntityMapsEqual(entities, entitiesHistory[entitiesHistory.length - 1])) {
        dispatch(addDiagramEntitiesStamp())
        console.log(1)
      }
    }
  }, [
    entities
  ])
}
