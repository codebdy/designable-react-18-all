import { DragStopEvent } from '../events'
import { Engine, CursorType, TreeNode, CursorDragType } from '../models'
import {
  calcRectByStartEndPoint,
  isCrossRectInRect,
  isRectInRect,
  Point,
} from 'designable/shared'

export const useFreeSelectionEffect = (engine: Engine) => {
  engine.subscribeTo(DragStopEvent, (event) => {
    if (engine.cursor?.dragType !== CursorDragType.Move) {
      return
    }
    engine.workbench?.eachWorkspace((workspace) => {
      const viewport = workspace.viewport
      const dragEndPoint = new Point(
        event.data.topClientX as any,
        event.data.topClientY as any
      )
      const dragStartOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor?.dragStartPosition?.topClientX as any,
          engine.cursor?.dragStartPosition?.topClientY as any
        )
      )
      const dragEndOffsetPoint = viewport.getOffsetPoint(
        new Point(
          engine.cursor?.position.topClientX as any,
          engine.cursor?.position.topClientY as any
        )
      )
      if (!viewport.isPointInViewport(dragEndPoint, false)) return
      const tree = workspace.operation.tree
      const selectionRect = calcRectByStartEndPoint(
        dragStartOffsetPoint,
        dragEndOffsetPoint,
        viewport.dragScrollXDelta,
        viewport.dragScrollYDelta
      )
      const selected: [TreeNode, DOMRect][] = []
      tree.eachChildren((node) => {
        const nodeRect = viewport.getValidNodeOffsetRect(node)
        if (nodeRect && isCrossRectInRect(selectionRect, nodeRect)) {
          selected.push([node, nodeRect as any])
        }
      })
      const selectedNodes: TreeNode[] = selected.reduce(
        (buf, [node, nodeRect]) => {
          if (isRectInRect(nodeRect, selectionRect)) {
            if (selected.some(([selectNode]) => selectNode.isMyParents(node))) {
              return buf
            }
          }
          return buf.concat(node as any)
        },
        []
      )
      workspace.operation.selection.batchSafeSelect(selectedNodes)
    })
    if (engine.cursor?.type === CursorType.Selection) {
      engine.cursor.setType(CursorType.Normal)
    }
  })
}
