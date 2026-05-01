import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IwPopoverContentComponent } from './popover.component';
import {
  SynPopoverDirective,
} from './popover.directive';
import { IwPopoverOptions } from './popover.options';

/**
 * This module includes and isolate iw-popover component.
 *
 * @stable
 * @version 1.0.0
 */
@NgModule({
  imports: [
    CommonModule,
    SynPopoverDirective,
    IwPopoverContentComponent
  ],
  exports: [
    SynPopoverDirective,
  ],
  providers: [
    IwPopoverOptions,
  ],
})
export class IwPopoverModule {}
