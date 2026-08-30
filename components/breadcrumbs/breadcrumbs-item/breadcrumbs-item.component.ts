import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'syn-breadcrumbs-item',
  templateUrl: './breadcrumbs-item.component.html',
  styleUrl: './breadcrumbs-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.selected]': 'selected()'
  }
})
export class SynapseBreadcrumbsItemComponent {
  public selected = input(false);
}
