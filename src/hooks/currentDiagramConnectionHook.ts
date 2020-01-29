import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../stores'
import { 
  Connection,
  FreeConnectionPoint,
  ConnectionAreaPoint,
  EntityConnectionPoint,
  ConnectionPathPoint,
  ConnectionType
} from '../types'
import { setCurrentDiagramConnection } from '../actions'
import { valueContainerCSS } from 'react-select/src/components/containers'

export const useCurrentDiagramConnectionController = () => {
  const currentConnection = useSelector((state: Store) => state.currentDiagramConnection)

  const dispatch = useDispatch()

  const setCurrentConnection = (connection: Connection) => {
    dispatch(setCurrentDiagramConnection(connection))
  }

  const setBeginPoint = (point: ConnectionPathPoint) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      begin: point,
    }))
  }

  const setEndPoint = (point: ConnectionPathPoint) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      end: point,
    }))
  }

  const setBeginFreePoint = (x: number, y: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      begin: new FreeConnectionPoint(x, y)
    }))
  }

  const setBeginAreaPoint = (entityId: number, areaId: number, position: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      begin: new ConnectionAreaPoint(entityId, areaId, position)
    }))
  }

  const setBeginEntityPoint = (entityId: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      begin: new EntityConnectionPoint(entityId)
    }))
  }

  const setEndFreePoint = (x: number, y: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      end: new FreeConnectionPoint(x, y)
    }))
  }

  const setEndAreaPoint = (entityId: number, areaId: number, position: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      end: new ConnectionAreaPoint(entityId, areaId, position)
    }))
  }

  const setEndEntityPoint = (entityId: number) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      end: new EntityConnectionPoint(entityId)
    }))
  }

  const setType = (type: ConnectionType) => {
    dispatch(setCurrentDiagramConnection({
      ...currentConnection,
      type,
    }))
  }

  const getConnection = () => {
    return currentConnection
  }

  const getBegin = () => {
    return currentConnection.begin
  }

  const getEnd = () => {
    return currentConnection.end
  }

  const getType = () => {
    return currentConnection.type
  }

  return {
    setCurrentConnection,
    setBeginPoint,
    setEndPoint,
    setType,
    setBeginFreePoint,
    setBeginAreaPoint,
    setBeginEntityPoint,
    setEndFreePoint,
    setEndAreaPoint,
    setEndEntityPoint,
    getConnection,
    getBegin,
    getEnd,
    getType
  }
}