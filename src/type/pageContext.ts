import { IilDtoStatusEnum } from "../ill-repo-client";

export enum PageContext {
    Graph = 0,
    FocusedList,
    List,
}

export const contextMapping: { [id: number] : string[]; } = {};
// context for editing
contextMapping[PageContext.Graph] = [IilDtoStatusEnum.NOTSTARTED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING];
contextMapping[PageContext.FocusedList] = [IilDtoStatusEnum.FOCUSED];
contextMapping[PageContext.List] = [IilDtoStatusEnum.NOTSTARTED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING, IilDtoStatusEnum.DONE, IilDtoStatusEnum.ACHIEVED ];