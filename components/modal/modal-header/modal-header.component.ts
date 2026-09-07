import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: 'syn-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'syn-modal-header',
  },
})
export class SynapseModalHeaderComponent {
  title = input<string>('');

  caption = input<string>('');
}