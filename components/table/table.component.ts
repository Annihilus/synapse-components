import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";

export type SynapseTableCell = string | number;

export interface SynapseTableData {
  headers: string[];
  rows: SynapseTableCell[][];
}

@Component({
  selector: 'syn-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'table',
  },
})
export class SynapseTableComponent {
  public data = input<SynapseTableData>({
    headers: [],
    rows: [],
  });
}
