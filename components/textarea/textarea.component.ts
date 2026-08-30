import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  fromEvent,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { SynapseLabelComponent } from '../label/label.component';
import { SynapseControlDirective, connectTextInput } from '../control-directives';

let nextTextareaId = 0;

@Component({
  selector: 'syn-textarea',
  imports: [SynapseLabelComponent],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.error]': 'showError()',
    '[class.focus]': 'isFocused()',
    '[class.active]': 'active()',
  },
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'error', 'disabled'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseTextareaComponent {
  protected readonly fieldId = `syn-textarea-${nextTextareaId++}`;

  protected readonly control = inject(SynapseControlDirective<string>);

  label = input('');
  placeholder = input('');
  tooltip = input('');
  required = input(false);

  readonly showError = this.control.showError;

  protected readonly errorText = computed(() => this.control.errorList().join(', '));

  protected readonly isFocused: Signal<boolean | undefined>;

  protected readonly active: Signal<boolean>;

  private element = viewChild.required<ElementRef<HTMLTextAreaElement>>('element');

  constructor() {
    connectTextInput(this.control, this.element);

    const element$ = toObservable(this.element).pipe(
      map(ref => ref.nativeElement),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.isFocused = toSignal(element$.pipe(switchMap(element => this.focusStream(element))));

    this.active = toSignal(
      element$.pipe(switchMap(element => this.activeStream(element))),
      { initialValue: false },
    );
  }

  private focusStream(element: HTMLTextAreaElement) {
    return merge(
      fromEvent(element, 'focus').pipe(map(() => true)),
      fromEvent(element, 'blur').pipe(map(() => false)),
    );
  }

  private activeStream(element: HTMLTextAreaElement) {
    const activate$ = merge(
      fromEvent(element, 'mousedown'),
      fromEvent(element, 'touchstart'),
    );

    const deactivate$ = merge(
      fromEvent(element, 'mouseup'),
      fromEvent(element, 'mouseleave'),
      fromEvent(element, 'touchend'),
    ).pipe(map(() => false));

    return activate$.pipe(switchMap(() => merge(of(true), deactivate$)));
  }
}
