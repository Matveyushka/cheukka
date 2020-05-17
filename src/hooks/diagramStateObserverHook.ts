import { useSelector } from "react-redux"
import { Store } from "../stores"
import React from "react"

export const useDiagramStateObserver = () => {
  const [
    entities,
    connections,
  ] = useSelector((state: Store) => [
    state.diagramEntities,
    state.diagramConnections,
  ])


  
  React.useEffect(() => {
    console.log(1)
  }, [
    entities,
    connections
  ])
}
