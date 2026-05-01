import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

@Component({
  selector: 'syn-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseTableComponent {
  public data = input<{
    headers: string[];
    rows: any[];
  }>({
    headers: [],
    rows: [],
  });
}