import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { SynapseIconComponent } from "../icon/icon.component";
import { TagColor } from "./tag.types";

export type { TagColor } from "./tag.types";

@Component({
  selector: 'syn-tag',
  imports: [SynapseIconComponent],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  host: {
    '[class]': 'getColorClass()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynapseTagComponent {
  closed = output<void>();

  color = input<TagColor>('cyan');

  icon = input<string>('');

  canBeDeleted = input(false);

  removeLabel = input('Remove');

  protected getColorClass() {
    return `color-${this.color()}`;
  }
}
