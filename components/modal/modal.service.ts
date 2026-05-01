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
import { DIALOG_CLOSE_BTN, DIALOG_DATA, DIALOG_SIZE } from './modal.tokens';
import { Observable } from 'rxjs';

export type ModalSize = 's' | 'm' | 'l';

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

    // eslint-disable-next-line prefer-const
    let modalRef: SynapseModalRef<T, R>;

    const modalInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: SynapseModalRef, useFactory: () => modalRef },
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

    modalRef = new SynapseModalRef<T, R>({} as T, windowRef, this.appRef);

    windowRef.instance.setModalRef(modalRef);

    const contentVC = windowRef.instance.content();
    if (!contentVC) throw new Error('Modal window content ViewContainerRef not found');

    const componentRef = contentVC.createComponent(component, {
      environmentInjector: this.envInjector,
      injector: modalInjector,
    });

    modalRef.componentInstance = componentRef.instance;

    return modalRef.afterClosed();
  }
}