import { InjectionToken } from '@angular/core';
import type { ModalSize } from './modal.types';

export type { ModalSize };

export const DIALOG_SIZE = new InjectionToken<ModalSize>('DIALOG_SIZE');
export const DIALOG_CLOSE_BTN = new InjectionToken<boolean>('DIALOG_CLOSE_BTN');
export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');
