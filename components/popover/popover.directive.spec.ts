import { Component, signal } from '@angular/core';
import { setupComponent } from '../../testing/setup';
import {
  SynapseDropdownDirective,
  SynapsePopoverDirective,
  SynapseTooltipDirective,
} from './popover.directive';

@Component({
  imports: [SynapseTooltipDirective],
  template: `<button synTooltip="Tooltip text" #tip="synTooltip">Hover me</button>`,
})
class TooltipHostComponent {}

@Component({
  imports: [SynapseDropdownDirective],
  template: `
    <button [synDropdown]="{ content: menu }" (openChange)="open.set($event)">Menu</button>
    <ng-template #menu><div class="menu-item">Item</div></ng-template>
  `,
})
class DropdownHostComponent {
  open = signal(false);
}

@Component({
  imports: [SynapsePopoverDirective],
  template: `
    <button
      [synPopover]="{ content: 'Manual', trigger: 'manual', side: 'right', align: 'end', panelClass: 'extra' }"
      #api="synPopover"
    >Trigger</button>
  `,
})
class ManualHostComponent {
  api!: SynapsePopoverDirective;
}

@Component({
  imports: [SynapseTooltipDirective],
  template: `<button [synTooltip]="{ content: 'Nope', disabled: true }">Trigger</button>`,
})
class DisabledHostComponent {}

@Component({
  imports: [SynapseTooltipDirective],
  template: `<button [synTooltip]="{ content: '' }">Trigger</button>`,
})
class EmptyHostComponent {}

@Component({
  imports: [SynapseTooltipDirective],
  template: `
    <button [synTooltip]="{ content: 'Instant', showDelay: 0, hideDelay: 0 }">Trigger</button>
  `,
})
class InstantHostComponent {}

const panel = () => document.querySelector('syn-popover-panel');

describe('popover directives', () => {
  afterEach(() => {
    document.querySelectorAll('.syn-popover-overlay').forEach(el => el.remove());
  });

  describe('synTooltip', () => {
    it('opens on hover after the delay and closes on leave', async () => {
      jest.useFakeTimers();
      const fixture = await setupComponent(TooltipHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      expect(panel()).toBeNull(); // showDelay=500

      jest.advanceTimersByTime(500);
      expect(panel()?.textContent).toContain('Tooltip text');

      button.dispatchEvent(new MouseEvent('mouseleave'));
      jest.advanceTimersByTime(100); // hideDelay
      expect(panel()).toBeNull();

      jest.useRealTimers();
    });

    it('opens on keyboard focus', async () => {
      jest.useFakeTimers();
      const fixture = await setupComponent(TooltipHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new FocusEvent('focusin'));
      jest.advanceTimersByTime(500);

      expect(panel()).toBeTruthy();
      expect(panel()?.getAttribute('role')).toBe('tooltip');
      jest.useRealTimers();
    });

    it('links trigger and tooltip through aria-describedby', async () => {
      jest.useFakeTimers();
      const fixture = await setupComponent(TooltipHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      jest.advanceTimersByTime(500);
      fixture.detectChanges();

      expect(button.getAttribute('aria-describedby')).toBe(panel()?.id);
      jest.useRealTimers();
    });
  });

  describe('synDropdown', () => {
    it('toggles on click and reports openChange', async () => {
      const fixture = await setupComponent(DropdownHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.open()).toBe(true);
      expect(document.querySelector('.menu-item')).toBeTruthy();

      button.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.open()).toBe(false);
      expect(panel()).toBeNull();
    });

    it('closes on Escape', async () => {
      const fixture = await setupComponent(DropdownHostComponent);
      (fixture.nativeElement.querySelector('button') as HTMLElement).click();
      expect(panel()).toBeTruthy();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(panel()).toBeNull();
    });

    it('closes on an outside click but not on one inside the panel', async () => {
      const fixture = await setupComponent(DropdownHostComponent);
      (fixture.nativeElement.querySelector('button') as HTMLElement).click();

      (document.querySelector('.menu-item') as HTMLElement).click();
      expect(panel()).toBeTruthy();

      document.body.click();
      expect(panel()).toBeNull();
    });

    it('sets aria-expanded on the trigger', async () => {
      const fixture = await setupComponent(DropdownHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      expect(button.getAttribute('aria-expanded')).toBe('false');

      button.click();
      fixture.detectChanges();
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('synPopover', () => {
    it('stays closed until show() is called and applies the variant classes', async () => {
      const fixture = await setupComponent(ManualHostComponent);
      const directive = fixture.debugElement.children[0]
        .injector.get(SynapsePopoverDirective);

      (fixture.nativeElement.querySelector('button') as HTMLElement).click();
      expect(panel()).toBeNull();

      directive.show();
      fixture.detectChanges();

      const el = panel() as HTMLElement;
      expect(el).toBeTruthy();
      expect(el.classList.contains('variant-popover')).toBe(true);
      expect(el.classList.contains('position-end')).toBe(true);
      expect(el.classList.contains('extra')).toBe(true);
      expect(directive.isOpen()).toBe(true);

      directive.hide();
      fixture.detectChanges();
      expect(panel()).toBeNull();
    });

    it('ignores repeated show and hide calls', async () => {
      const fixture = await setupComponent(ManualHostComponent);
      const directive = fixture.debugElement.children[0]
        .injector.get(SynapsePopoverDirective);

      directive.hide();
      expect(panel()).toBeNull();

      directive.show();
      directive.show();
      expect(document.querySelectorAll('syn-popover-panel').length).toBe(1);

      directive.toggle();
      expect(panel()).toBeNull();
    });

    it('does not open while disabled', async () => {
      const fixture = await setupComponent(DisabledHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(panel()).toBeNull();
    });

    it('does not open with empty content', async () => {
      const fixture = await setupComponent(EmptyHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(panel()).toBeNull();
    });

    it('reuses one overlay container for every panel', async () => {
      const fixture = await setupComponent(ManualHostComponent);
      const directive = fixture.debugElement.children[0]
        .injector.get(SynapsePopoverDirective);

      directive.show();
      directive.hide();
      directive.show();

      expect(document.querySelectorAll('.syn-popover-overlay').length).toBe(1);
    });
  });

  describe('delays', () => {
    it('opens and closes immediately with zero delays', async () => {
      const fixture = await setupComponent(InstantHostComponent);
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      expect(panel()).toBeTruthy();

      button.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();
      expect(panel()).toBeNull();
    });

    it('keeps the panel open while the pointer is over it', async () => {
      const fixture = await setupComponent(TooltipHostComponent);
      jest.useFakeTimers();
      const button = fixture.nativeElement.querySelector('button') as HTMLElement;

      button.dispatchEvent(new MouseEvent('mouseenter'));
      jest.advanceTimersByTime(500);
      const el = panel() as HTMLElement;
      expect(el).toBeTruthy();

      button.dispatchEvent(new MouseEvent('mouseleave'));
      el.dispatchEvent(new MouseEvent('mouseenter'));
      jest.advanceTimersByTime(1000);
      expect(panel()).toBeTruthy();

      el.dispatchEvent(new MouseEvent('mouseleave'));
      jest.advanceTimersByTime(200);
      expect(panel()).toBeNull();

      jest.useRealTimers();
    });
  });

  describe('reposition', () => {
    it('recomputes the position on scroll and resize', async () => {
      const fixture = await setupComponent(ManualHostComponent);
      const directive = fixture.debugElement.children[0]
        .injector.get(SynapsePopoverDirective);

      directive.show();
      fixture.detectChanges();

      const before = (panel() as HTMLElement).style.top;

      document.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(panel()).toBeTruthy();
      expect((panel() as HTMLElement).style.top).toBe(before);
    });
  });
});
