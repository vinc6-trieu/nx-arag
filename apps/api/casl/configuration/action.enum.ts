import { DefaultActions } from 'nest-casl';

// Custom actions can be defined here
enum CustomActions {}

export type Actions = DefaultActions | CustomActions;
export const Actions = { ...DefaultActions, ...CustomActions };
