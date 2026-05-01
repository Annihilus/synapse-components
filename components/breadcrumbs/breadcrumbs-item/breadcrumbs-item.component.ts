import { CommonModule } from '@angular/common';
import {
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'syn-breadcrumbs-item',
  imports: [CommonModule],
  templateUrl: './breadcrumbs-item.component.html',
  styleUrl: './breadcrumbs-item.component.scss',
  host: {
    '[class.selected]': 'selected()'
  }
})
export class SynapseBreadcrumbsItemComponent {
  public selected = input(false);
}
