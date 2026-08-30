import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  computed,
  contentChild,
  forwardRef,
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
  tap,
} from 'rxjs';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseLabelComponent } from '../label/label.component';
import { SynapseControlDirective, connectTextInput } from '../control-directives';

let nextInputId = 0;

@Component({
  selector: 'syn-input',
  imports: [
    SynapseLabelComponent,
    SynapseIconComponent,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.error]': 'showError()',
    '[class.focus]': 'isFocused()',
    '[class.active]': 'active()',
    '[class.inline]': 'inline()',
  },
  hostDirectives: [
    {
      directive: SynapseControlDirective,
      inputs: ['value', 'error', 'disabled'],
      outputs: ['valueChanged'],
    },
  ],
})
export class SynapseInputComponent {
  protected readonly fieldId = `syn-input-${nextInputId++}`;

  protected readonly control = inject(SynapseControlDirective<string>);

  label = input('');
  placeholder = input('');
  tooltip = input('');
  required = input(false);
  inline = input<boolean>(false);

  readonly icon = contentChild(forwardRef(() => SynapseIconComponent));

  readonly showError = this.control.showError;

  protected readonly errorText = computed(() => this.control.errorList().join(', '));

  /** Drives the invisible sizer that widens the inline variant. */
  protected readonly valueText = computed(() => this.control.current() ?? '');

  protected readonly isFocused: Signal<boolean | undefined>;

  /** Pressed state, mirroring the `:active` styling hook in the mixin. */
  protected readonly active: Signal<boolean>;

  private element = viewChild.required<ElementRef<HTMLInputElement>>('element');

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

  private focusStream(element: HTMLInputElement) {
    return merge(
      fromEvent(element, 'focus').pipe(map(() => true)),
      fromEvent(element, 'blur').pipe(
        // Rewind so `text-overflow: ellipsis` trims the tail rather than
        // leaving the field scrolled to the caret.
        tap(() => { element.scrollLeft = 0; }),
        map(() => false),
      ),
    );
  }

  private activeStream(element: HTMLInputElement) {
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
