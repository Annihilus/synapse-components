import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';

/** Its own component so arbitrary projected nodes can sit between crumbs. */
@Component({
  selector: 'syn-breadcrumbs-separator',
  imports: [SynapseIconComponent],
  templateUrl: './breadcrumbs-separator.component.html',
  styleUrl: './breadcrumbs-separator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
  },
})
export class SynapseBreadcrumbsSeparatorComponent {}
