import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'
import { globalThisPolyfill } from 'designable/shared'

export const useLayout = (): IDesignerLayoutContext => {
  return (
    globalThisPolyfill['__DESIGNABLE_LAYOUT__'] ||
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useContext(DesignerLayoutContext)
  )
}
