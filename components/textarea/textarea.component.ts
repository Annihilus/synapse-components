import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  merge,
  of,
  switchMap,
} from 'rxjs';

import { SynapseIconComponent } from '../icon/icon.component';
import { SynapseLabelComponent } from '../label/label.component';

@Component({
  selector: 'syn-textarea',
  imports: [
    SynapseLabelComponent,
    SynapseIconComponent,
  ],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.error]': 'error()',
    '[class.filled]': 'filled()',
    '[class.focus]': 'focused()',
    '[class.active]': 'active()',
  }
})
export class SynapseTextareaComponent implements AfterViewInit {
  label = input('');
  placeholder = input('');
  value = input('');
  error = input<string | string[]>('');
  tooltip = input('');
  required = input(false);
  filled = signal(false);
  active = signal(false);
  focused = signal(false);

  private element = viewChild<ElementRef<HTMLInputElement>>('element');

  ngAfterViewInit(): void {
    const el = this.element()?.nativeElement;

    if (el) {
      const activate$ = merge(
        fromEvent(el, 'mousedown'),
        fromEvent(el, 'touchstart')
      ).pipe(map(() => true));

      const deactivate$ = merge(
        fromEvent(el, 'mouseup'),
        fromEvent(el, 'mouseleave'),
        fromEvent(el, 'touchend')
      ).pipe(map(() => false));

      const active$ = activate$.pipe(
        switchMap(() => merge(
          of(true),
          deactivate$
        ))
      );

      merge(
        fromEvent(el, 'focus').pipe(map(() => true)),
        fromEvent(el, 'blur').pipe(map(() => false)),
      ).subscribe(isFocused => this.focused.set(isFocused));

      fromEvent(el, 'input')
        .pipe(
          map(() => Boolean(el.value)),
          distinctUntilChanged(),
        )
        .subscribe(val => this.filled.set(val))

      active$.subscribe(isActive => this.active.set(isActive));
    }
  }
}