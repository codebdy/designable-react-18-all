import * as Core from './exports'
import { globalThisPolyfill } from 'designable/shared'
export * from './exports'

if (globalThisPolyfill?.['Designable' as any]?.['Core' as any]) {
  if (module.exports) {
    module.exports = {
      __esModule: true,
      ...globalThisPolyfill['Designable' as any]['Core' as any],
    }
  }
} else {
  globalThisPolyfill['Designable' as any] = globalThisPolyfill['Designable' as any] || {} as any
  (globalThisPolyfill['Designable' as any] as any).Core = Core
}
