import { Component, input } from "@angular/core";

@Component({
  selector: 'syn-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class SynapseModalHeaderComponent {
  title = input<string>('');

  caption = input<string>('');
}