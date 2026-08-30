import {
  ApplicationRef,
  ComponentRef,
  Injectable,
  Injector,
  Type,
  createComponent,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { SynapseModalRef } from './modal.ref';
import { SynapseModalWindowComponent } from './modal-window/modal-window.component';
import { DIALOG_CLOSE_BTN, DIALOG_DATA, DIALOG_SIZE, ModalSize } from './modal.tokens';
import { Observable } from 'rxjs';

export type { ModalSize } from './modal.tokens';

@Injectable()
export class SynapseModalService {
  private readonly appRef = inject(ApplicationRef);

  private readonly injector = inject(Injector);

  private readonly envInjector = inject(EnvironmentInjector);

  open<T, D, R = unknown>(
    component: Type<T>,
    config?: { data?: D; size?: ModalSize; closeBtn?: boolean },
  ): Observable<{ result?: R; reason: string }> {
    const modalSize: ModalSize = config?.size ?? 'm';

    const opened: { ref?: SynapseModalRef<T, R> } = {};

    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: SynapseModalRef, useFactory: () => opened.ref },
        { provide: DIALOG_DATA, useValue: config?.data },
        { provide: DIALOG_SIZE, useValue: modalSize },
        { provide: DIALOG_CLOSE_BTN, useValue: config?.closeBtn ?? true },
      ],
    });

    const windowRef: ComponentRef<SynapseModalWindowComponent> = createComponent(
      SynapseModalWindowComponent,
      { environmentInjector: this.envInjector, elementInjector: modalInjector }
    );

    this.appRef.attachView(windowRef.hostView);
    document.body.appendChild(windowRef.location.nativeElement);

    const modalRef = new SynapseModalRef<T, R>({} as T, windowRef, this.appRef);
    opened.ref = modalRef;

    windowRef.instance.setModalRef(modalRef);

    const componentRef = windowRef.instance.content().createComponent(component, {
      environmentInjector: this.envInjector,
      injector: modalInjector,
    });

    modalRef.componentInstance = componentRef.instance;

    return modalRef.afterClosed();
  }
}