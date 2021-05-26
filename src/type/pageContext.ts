import { TascState } from './tascState';
export enum PageContext {
    Incoming = 0,
    Organizing,
    Focusing,
    Admin,
}

export const contextMapping: { [id: number] : number[]; } = {};
// context for editing
contextMapping[PageContext.Incoming] = [TascState.Active, TascState.Focused, TascState.Pending, TascState.Done];
contextMapping[PageContext.Organizing] = [TascState.Active, TascState.Focused, TascState.Pending];
contextMapping[PageContext.Focusing] = [TascState.Focused];
contextMapping[PageContext.Admin] = [TascState.None, TascState.Active, TascState.Focused, TascState.Pending, TascState.Done, ];
