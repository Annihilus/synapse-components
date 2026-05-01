import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';

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
  },
})
export class SynapseTabsComponent implements AfterContentInit {
  initialActiveTab = input('');

  changed = output<string>();

  tabs = contentChildren(SynapseTabComponent);

  private readonly _service = inject(SynapseTabsService);

  constructor() {
    this._service.selected$
      .subscribe(selected => {
        this.setTabsState(selected)

        this.changed.emit(selected.name())
      })
  }

  ngAfterContentInit(): void {
    const active = this.tabs().find(tab => tab.name() === this.initialActiveTab());

    active?.selectTab();
  }

  private setTabsState(selected: SynapseTabComponent) {
    this.tabs().forEach((tab) => {
      if (selected.name !== tab.name) {
        tab.deselectTab();
      }
    })
  }
}
