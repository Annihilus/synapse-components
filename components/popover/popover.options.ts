import {
  Injectable,
  TemplateRef,
} from '@angular/core';
import {
  Modifier,
  Obj,
  Placement,
} from '@popperjs/core';
import { Observable } from 'rxjs';

import { PopoverContext } from './popover.component';

export type PopoverOptions = Partial<IwPopoverOptions> & {
  content: PopoverContent;
};

export type PopoverShowEvent = undefined | MouseEvent | { x: number; y: number; context?: PopoverContext };

export type PopoverShowStream = Observable<PopoverShowEvent>;

export type PopoverHideStream = Observable<Event | MouseEvent>;

type PopoverObservableTriggers = [
  PopoverShowStream,
  PopoverHideStream,
];

export type PopoverTriggers = string | PopoverObservableTriggers;

type PopoverContent = string | TemplateRef<unknown>;

type EllipsisOptions = {
  lines?: number;
};

@Injectable()
export class IwPopoverOptions {
  public disabled = false;

  public content: string | TemplateRef<unknown> = '';

  public placement: Placement = 'top';

  public showDelay = 150;

  public hideDelay = 0;

  public triggers: PopoverTriggers = 'click:click';

  public noStyles = false;

  public dropdown = false;

  public tooltip = false;

  public animations: string[] = [];

  public arrow = false;

  public followCursor = false;

  public ellipsis: boolean | EllipsisOptions = false;

  public modifiers: Partial<Modifier<string, Obj>>[] = [
    {
      name: 'offset',
      options: {
        offset: [20, 20],
      },
    },
  ];

  public widthMinLimit = false;

  public widthMaxLimit = false;

  public container = '';

  public zIndex = 10_000;

  public popoverStyle: Record<string, unknown> = {};

  public context: PopoverContext = {};
}

export const DEFAULT_OPTIONS = {
  disabled: false,
  content: '',
  container: '',
  animations: [],
  arrow: false,
  followCursor: false,
  modifiers: [],
  widthMinLimit: false,
  widthMaxLimit: false,
  zIndex: 10_000,
  popoverStyle: {},
  context: {},
  showDelay: 150,
  hideDelay: 0,
  noStyles: false,
};

export const TOOLTIP_DEFAULT_OPTIONS: IwPopoverOptions = {
  ...DEFAULT_OPTIONS,
  placement: 'top',
  triggers: 'mouseenter:mouseleave',
  arrow: true,
  tooltip: true,
  dropdown: false,
  ellipsis: true,
  showDelay: 500,
  container: 'body',
  animations: ['fade', 'scale'],
};

export const DROPDOWN_DEFAULT_OPTIONS: IwPopoverOptions = {
  ...DEFAULT_OPTIONS,
  placement: 'bottom-end',
  triggers: 'click:click',
  dropdown: true,
  tooltip: false,
  ellipsis: false,
  animations: ['fade', 'scale'],
};

export const POPOVER_DEFAULT_OPTIONS: IwPopoverOptions = {
  ...DEFAULT_OPTIONS,
  placement: 'bottom-end',
  showDelay: 150,
  hideDelay: 100,
  triggers: 'click:click',
  dropdown: false,
  tooltip: false,
  ellipsis: false,
};
