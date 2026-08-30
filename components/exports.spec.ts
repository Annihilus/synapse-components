import * as breadcrumbs from './breadcrumbs';
import * as button from './button';
import * as controlDirectives from './control-directives';
import * as modal from './modal';
import * as popover from './popover';

/** Touching each binding also exercises the re-export accessors. */
function allDefined(bag: Record<string, unknown>, names: string[]) {
  return names.every(name => bag[name] !== undefined);
}

describe('public barrels', () => {
  it('re-exports the breadcrumbs pieces', () => {
    expect(allDefined(breadcrumbs, [
      'SynapseBreadcrumbsComponent',
      'SynapseBreadcrumbsItemComponent',
      'SynapseBreadcrumbsSeparatorComponent',
    ])).toBe(true);
  });

  it('re-exports the button component', () => {
    expect(button.SynapseButtonComponent).toBeDefined();
  });

  it('re-exports the shared control directive', () => {
    expect(controlDirectives.SynapseControlDirective).toBeDefined();
  });

  it('re-exports the modal surface', () => {
    expect(modal.SynapseModalRef).toBeDefined();
    expect(modal.SynapseModalService).toBeDefined();
    expect(modal.DIALOG_DATA).toBeDefined();
    expect(modal.SynapseModalHeaderComponent).toBeDefined();
    expect(modal.SynapseModalContentComponent).toBeDefined();
    expect(modal.SynapseModalFooterComponent).toBeDefined();
  });

  it('re-exports the popover directives, panel and positioning', () => {
    expect(popover.SynapsePopoverBaseDirective).toBeDefined();
    expect(popover.SynapsePopoverDirective).toBeDefined();
    expect(popover.SynapseTooltipDirective).toBeDefined();
    expect(popover.SynapseDropdownDirective).toBeDefined();
    expect(popover.SynapsePopoverPanelComponent).toBeDefined();
    expect(popover.computePopoverPosition).toBeDefined();
    expect(popover.POPOVER_DEFAULTS).toBeDefined();
  });
});
