import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SynapseIconComponent } from '../icon/icon.component';

import { SynapseBreadcrumbsItemComponent } from './breadcrumbs-item/breadcrumbs-item.component';

@Component({
  selector: 'syn-breadcrumbs',
  imports: [CommonModule, SynapseBreadcrumbsItemComponent, SynapseIconComponent],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class SynapseBreadcrumbsComponent {}
