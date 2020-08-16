import React from "react"
import { useCookies } from "react-cookie"
import { useDiagramStateObserver } from "./diagramStateObserverHook";

export const useRecoveryDispather = () => {
  const [cookies, setCookie] = useCookies(['recoveryRequired', 'savedState']);

  useDiagramStateObserver()

  React.useEffect(() => {
    const recoveryRequired = !!+cookies.recoveryRequired
    console.log(recoveryRequired)
    if (!recoveryRequired) {
      setCookie('recoveryRequired', 0, { path: '/' });
    } else {
      if (cookies.savedState) {
        //recovery diagram
      }
    }
  }, [])

}