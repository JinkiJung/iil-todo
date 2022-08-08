import { IilDtoStatusEnum } from "../ill-repo-client";

export enum PageContext {
    Graph = 0,
    FocusedList,
    List,
}

export const isOrganizeMode = (pageContext: PageContext) => {
    return pageContext === PageContext.FocusedList;
  };

export const contextMapping: { [id: number] : string[]; } = {};
// context for editing
contextMapping[PageContext.Graph] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING];
contextMapping[PageContext.FocusedList] = [IilDtoStatusEnum.FOCUSED];
contextMapping[PageContext.List] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING, IilDtoStatusEnum.SETTLED, ];