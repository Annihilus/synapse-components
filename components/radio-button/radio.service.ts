import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SynapseRadioService {
  private _selected$ = new Subject<string>();
  selected$ = this._selected$.asObservable()

  public setSelected(name: string) {
    this._selected$.next(name);
  }
}