import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { SynapseTabsService } from '../tabs.service';

@Component({
  selector: 'syn-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-tab',
    'role': 'tab',
    '[class.selected]': 'isSelected()',
    '[attr.aria-selected]': 'isSelected()',
    // Roving tabindex: one Tab reaches the list, arrows move within it.
    '[attr.tabindex]': 'isSelected() ? 0 : -1',
    '(click)': 'selectTab()',
    '(keydown.enter)': 'selectTab()',
    '(keydown.space)': 'onSpace($event)',
  },
})
export class SynapseTabComponent {
  public selected = input(false);

  isSelected = signal(false);

  name = input('');

  readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly _service = inject(SynapseTabsService);

  constructor() {
    effect(() => {
      this.isSelected.set(this.selected());
    });
  }

  protected onSpace(event: Event) {
    // On `role="tab"` Space activates the tab instead of scrolling the page.
    event.preventDefault();
    this.selectTab();
  }

  focus() {
    this.elementRef.nativeElement.focus();
  }

  deselectTab() {
    this.isSelected.set(false);
  }

  selectTab() {
    this.isSelected.set(true);
    this._service.select(this);
  }
}
