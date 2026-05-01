import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, signal, createComponent, inject } from '@angular/core';
import { SynapseSnackbarContainerComponent } from './snackbar-container/snackbar-container.component';
import { SnackbarMessage } from './model';

@Injectable({
  providedIn: 'root'
})
export class SynapseSnackbarService {
  private messages = signal<SnackbarMessage[]>([]);

  readonly messages$ = this.messages.asReadonly();

  private idCounter = 0;

  private containerRef: ComponentRef<SynapseSnackbarContainerComponent> | null = null;

  private appRef = inject(ApplicationRef);

  private injector = inject(EnvironmentInjector);

  show(title: string, message: string, type: SnackbarMessage['type'] = 'default', duration = 5000000) {
    this.ensureContainer();

    const id = `snackbar-${this.idCounter++}`;
    const newMessage: SnackbarMessage = { id, message, type, title, duration };

    this.messages.update(messages => [newMessage, ...messages]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: string) {
    this.messages.update(messages => messages.filter(message => message.id !== id));
  }

  clear() {
    this.messages.set([]);
  }

  private ensureContainer() {
    if (this.containerRef) {
      return;
    }

    // Create the component dynamically
    this.containerRef = createComponent(SynapseSnackbarContainerComponent, {
      environmentInjector: this.injector
    });

    if (this.containerRef) {
      // Attach to application
      this.appRef.attachView(this.containerRef.hostView);

      // Append to document body
      const domElem = (this.containerRef.hostView as any).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);
    }
  }

  destroy() {
    if (this.containerRef) {
      this.appRef.detachView(this.containerRef.hostView);
      this.containerRef.destroy();
      this.containerRef = null;
    }
  }
}