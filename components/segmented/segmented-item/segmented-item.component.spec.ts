import { Component } from '@angular/core';
import { setupComponent } from '../../../testing/setup';
import { SynapseSegmentedItemComponent } from './segmented-item.component';
import { SynapseIconComponent } from '../../icon/icon.component';

@Component({
  imports: [SynapseSegmentedItemComponent],
  template: `<button syn-segmented-item name="a">Label</button>`,
})
class WithTextComponent {}

@Component({
  imports: [SynapseSegmentedItemComponent],
  template: `<button syn-segmented-item name="b" icon="check"></button>`,
})
class IconOnlyComponent {}

@Component({
  imports: [SynapseSegmentedItemComponent],
  template: `<button syn-segmented-item name="c"><span>Wrapped</span></button>`,
})
class WrappedTextComponent {}

@Component({
  imports: [SynapseSegmentedItemComponent, SynapseIconComponent],
  template: `<button syn-segmented-item name="d" icon="check"><span></span></button>`,
})
class EmptyWrapperComponent {}

@Component({
  imports: [SynapseSegmentedItemComponent, SynapseIconComponent],
  template: `<button syn-segmented-item name="e"> <syn-icon name="check" /> </button>`,
})
class IconChildComponent {}

describe('SynapseSegmentedItemComponent', () => {
  it('marks an item that carries a label', async () => {
    const fixture = await setupComponent(WithTextComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('text')).toBe(true);
  });

  it('leaves an icon-only item unmarked', async () => {
    const fixture = await setupComponent(IconOnlyComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('text')).toBe(false);
  });

  it('counts an element wrapper as a label', async () => {
    const fixture = await setupComponent(WrappedTextComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('text')).toBe(true);
  });

  it('does not count an empty wrapper as a label', async () => {
    const fixture = await setupComponent(EmptyWrapperComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('text')).toBe(false);
  });

  it('ignores whitespace and a projected icon element', async () => {
    const fixture = await setupComponent(IconChildComponent);
    await fixture.whenStable();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.classList.contains('text')).toBe(false);
  });
});
