import { useState, useEffect, useMemo, useCallback } from 'react'
import { TreeNode, CursorStatus, CursorDragType } from 'designable/core'
import { LayoutObserver } from 'designable/shared'
import { useViewport } from './useViewport'
import { useDesigner } from './useDesigner'

const isEqualRect = (rect1: DOMRect, rect2: DOMRect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  )
}

export const useValidNodeOffsetRect = (node: TreeNode) => {
  const engine = useDesigner()
  const viewport = useViewport()
  const [, forceUpdate] = useState(null)
  const rectRef = useMemo(
    () => ({ current: viewport.getValidNodeOffsetRect(node) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewport]
  )

  const element = viewport.findElementById(node?.id)

  const compute = useCallback(() => {
    if (
      engine.cursor.status !== CursorStatus.Normal &&
      engine.cursor.dragType === CursorDragType.Move
    )
      return
    const nextRect = viewport.getValidNodeOffsetRect(node)
    if (!isEqualRect(rectRef.current as any, nextRect as any) && nextRect) {
      rectRef.current = nextRect
      forceUpdate([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport, node])

  useEffect(() => {
    const layoutObserver = new LayoutObserver(compute)
    if (element) layoutObserver.observe(element)
    return () => {
      layoutObserver.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, viewport, element])
  return rectRef.current
}
