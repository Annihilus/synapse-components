import { type ComponentRef, type ApplicationRef } from '@angular/core';
import { Subject, type Observable } from 'rxjs';

export class SynapseModalRef<T, R = unknown> {
  private readonly _afterClosed = new Subject<{ result?: R; reason: string }>();

  constructor(
    public componentInstance: T,
    private windowRef: ComponentRef<unknown>,
    private appRef: ApplicationRef
  ) {}

  private closed = false;

  close({ reason, result }: { reason: string; result?: R } = { reason: 'dismiss' }): void {
    // The close button, Escape and the backdrop can all fire: without this
    // guard a second call would hit a completed Subject and a destroyed view.
    if (this.closed) return;
    this.closed = true;

    this._afterClosed.next({ result, reason });
    this._afterClosed.complete();

    const nativeEl = this.windowRef.location.nativeElement;
    if (nativeEl.parentNode) {
      nativeEl.parentNode.removeChild(nativeEl);
    }

    this.appRef.detachView(this.windowRef.hostView);
    this.windowRef.destroy();
  }

  afterClosed(): Observable<{ result?: R; reason: string }> {
    return this._afterClosed.asObservable();
  }
}
