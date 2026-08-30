import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'syn-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseBreadcrumbsComponent {}
