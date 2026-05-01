import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SynapseTabComponent } from './tab/tab.component';

@Injectable()
export class SynapseTabsService {
  private _select$ = new Subject<SynapseTabComponent>();
  readonly selected$ = this._select$.asObservable();

  select(tab: SynapseTabComponent) {
    this._select$.next(tab);
  }
}