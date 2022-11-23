import { useContext, useEffect } from 'react'
import { Engine } from 'designable/core'
import { DesignerEngineContext } from '../context'
import { isFn, globalThisPolyfill } from 'designable/shared'
export interface IEffects {
  (engine: Engine): void
}

export const useDesigner = (effects?: IEffects): Engine => {
  const designer: Engine =
    globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContext(DesignerEngineContext)
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return designer
}
