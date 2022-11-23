import { each, isPlainObj } from 'designable/shared'
import { globalThisPolyfill } from 'designable/shared'

export const lowerSnake = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

export const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value, key) {
      const token = lowerSnake(key)
      const messages = mergeLocales((target as any)[key] || (target as any)[token] , value) as any
      (target as any)[token] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {}
    each(source, function (value, key) {
      const messages = mergeLocales(undefined, value) as any
      (result as any)[lowerSnake(key)] = messages
    })
    return result
  }
  return source
}

export const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!globalThisPolyfill.navigator) {
    return 'en'
  }
  return (
    (globalThisPolyfill.navigator as any)['browserlanguage'] ||
    globalThisPolyfill.navigator?.language ||
    'en'
  )
}
