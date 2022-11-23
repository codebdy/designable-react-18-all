import { EventDriver } from 'designable/shared'
import { Engine } from '../models/Engine'
import { MouseMoveEvent } from '../events'
export class MouseMoveDriver extends EventDriver<Engine> {
  request = null

  onMouseMove = (e: MouseEvent) => {
    this.request = requestAnimationFrame(() => {
      cancelAnimationFrame(this.request as any)
      this.dispatch(
        new MouseMoveEvent({
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
          target: e.target,
          view: e.view,
        } as any)
      )
    }) as any
  }

  attach() {
    this.addEventListener('mousemove', this.onMouseMove, {
      mode: 'onlyOne',
    })
  }

  detach() {
    this.removeEventListener('mouseover', this.onMouseMove, {
      mode: 'onlyOne',
    })
  }
}
