import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SynapseTabComponent } from './tab/tab.component';
import { SynapseTabsService } from './tabs.service';

@Component({
  selector: 'syn-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [ SynapseTabsService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'syn-tab-panel',
    'role': 'tablist',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SynapseTabsComponent implements AfterContentInit {
  initialActiveTab = input('');

  changed = output<string>();

  tabs = contentChildren(SynapseTabComponent);

  private readonly _service = inject(SynapseTabsService);

  constructor() {
    this._service.selected$
      .pipe(takeUntilDestroyed())
      .subscribe(selected => {
        this.setTabsState(selected)

        this.changed.emit(selected.name())
      })
  }

  ngAfterContentInit(): void {
    const active = this.tabs().find(tab => tab.name() === this.initialActiveTab());

    active?.selectTab();
  }

  protected onKeydown(event: KeyboardEvent) {
    const tabs = this.tabs();
    if (!tabs.length) return;

    const current = tabs.findIndex(tab => tab.isSelected());
    const from = current === -1 ? 0 : current;

    let next: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (from + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (from - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
    }

    if (next === null) return;

    event.preventDefault();
    tabs[next].selectTab();
    tabs[next].focus();
  }

  private setTabsState(selected: SynapseTabComponent) {
    this.tabs().forEach((tab) => {
      if (tab !== selected) {
        tab.deselectTab();
      }
    })
  }
}
