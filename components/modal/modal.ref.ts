import { ComponentRef, ApplicationRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class SynapseModalRef<T, R = unknown> {
  private readonly _afterClosed = new Subject<any>();

  constructor(
    public componentInstance: T,
    private windowRef: ComponentRef<unknown>,
    private appRef: ApplicationRef
  ) {}

  close({ reason, result }: { reason: string; result?: R } = { reason: 'dismiss' }): void {
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
