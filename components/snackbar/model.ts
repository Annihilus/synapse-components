export type SnackbarType = 'success' | 'error' | 'warning' | 'default';
export interface SnackbarMessage {
  id: string;
  title: string;
  message: string;
  type: SnackbarType;
  duration?: number;
}