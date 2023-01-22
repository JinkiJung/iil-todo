import { IilDtoStateEnum } from "../ill-repo-client";

export enum PageContext {
    Graph = 0,
    FocusedList,
    List,
}

export const contextMapping: { [id: number] : string[]; } = {};
// context for editing
contextMapping[PageContext.Graph] = [IilDtoStateEnum.NOTACTIVATED, IilDtoStateEnum.ACTIVE, IilDtoStateEnum.FOCUSED, IilDtoStateEnum.PENDING];
contextMapping[PageContext.FocusedList] = [IilDtoStateEnum.FOCUSED];
contextMapping[PageContext.List] = [IilDtoStateEnum.NOTACTIVATED, IilDtoStateEnum.ACTIVE, IilDtoStateEnum.FOCUSED, IilDtoStateEnum.PENDING, IilDtoStateEnum.FINISHED, IilDtoStateEnum.ACHIEVED ];