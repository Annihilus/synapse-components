import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import {
  fromEvent,
  map,
  merge,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseLabelComponent } from '../label/label.component';
import { IwElementFilledStateDirective, IwElementFormControlDirective, IwElementValidStateDirective, IwElementValueControlDirective } from '../control-directives';
import { ReactiveFormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'syn-input',
  imports: [
    ReactiveFormsModule,
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
      directive: IwElementFormControlDirective,
      inputs: ['formControlName', 'formControl', 'errors'],
    },
    {
      directive: IwElementValueControlDirective,
      inputs: ['value'],
      outputs: ['valueChanged'],
    },
    {
      directive: IwElementFilledStateDirective,
      inputs: ['value'],
    },
    {
      directive: IwElementValidStateDirective,
      inputs: ['errors:error'],
    },
  ],
})
export class SynapseInputComponent {
  label = input('');
  placeholder = input('');
  error = input<string | string[]>('');
  tooltip = input('');
  required = input(false);
  inline = input<boolean>(false);
  active = signal(false);
  focused = signal(false);

  private readonly _text = signal('');

  protected readonly valueText = this._text.asReadonly();

  public readonly icon = contentChild(forwardRef(() => SynapseIconComponent));

  protected readonly isFocused: Signal<boolean | undefined>;

  private element = viewChild.required<ElementRef<HTMLInputElement>>('element');

  protected readonly formControl = inject(IwElementFormControlDirective<string>);
  private readonly _validState = inject(IwElementValidStateDirective);
  private readonly filled = inject(IwElementFilledStateDirective<string>);
  private readonly _valueControl = inject(IwElementValueControlDirective<string>);

  /**
   * Whether to render the error state. With forms: touched + invalid (gated by
   * the form-control directive). Without forms: as soon as a non-empty `[error]`
   * is passed directly, surfaced via the valid-state directive.
   */
  protected readonly showError = computed(() =>
    !!this.formControl.displayErrors() ||
    (!this.formControl.control() && this._validState.isInvalid()),
  );

  constructor() {
    const registerStream$ = toObservable<ElementRef<HTMLInputElement>>(this.element)
      .pipe(
        map(element => element.nativeElement),
        tap((element: HTMLInputElement) => {
          this._valueControl.registerInputElement(element);
          this.filled.registerElement(element);
          this.formControl.registerElement(element);
        }),
        switchMap(element => this._getFocusStream(element)),
      );

    this.isFocused = toSignal(registerStream$);

    effect((onCleanup) => {
      const bound = this._valueControl.value();
      if (bound !== undefined) this._text.set(bound);

      const control = this.formControl.control();
      if (!control) return;

      this._text.set((control.value ?? '') as string);

      const sub = control.valueChanges.subscribe((value) =>
        this._text.set((value ?? '') as string),
      );
      onCleanup(() => sub.unsubscribe());
    });
  }

  protected onInput(value: string): void {
    this._text.set(value);
  }

  private _getFocusStream(element: HTMLInputElement) {
    return merge(
      fromEvent(element, 'focus').pipe(map(() => true)),
      fromEvent(element, 'blur').pipe(map(() => false)),
    );
  }
}