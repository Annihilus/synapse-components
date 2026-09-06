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

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  private appRef = inject(ApplicationRef);

  private injector = inject(EnvironmentInjector);

  show(title: string, message: string, type: SnackbarMessage['type'] = 'default', duration = 5000) {
    this.ensureContainer();

    const id = `snackbar-${this.idCounter++}`;
    const newMessage: SnackbarMessage = { id, message, type, title, duration };

    this.messages.update(messages => [newMessage, ...messages]);

    if (duration > 0) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), duration));
    }
  }

  dismiss(id: string) {
    this.clearTimer(id);
    this.messages.update(messages => messages.filter(message => message.id !== id));
  }

  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.messages.set([]);
  }

  private clearTimer(id: string) {
    const timer = this.timers.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private ensureContainer() {
    if (this.containerRef) {
      return;
    }

    this.containerRef = createComponent(SynapseSnackbarContainerComponent, {
      environmentInjector: this.injector,
    });

    this.appRef.attachView(this.containerRef.hostView);
    document.body.appendChild(this.containerRef.location.nativeElement);
  }

  destroy() {
    this.clear();

    if (this.containerRef) {
      this.appRef.detachView(this.containerRef.hostView);
      this.containerRef.destroy();
      this.containerRef = null;
    }
  }
}