import { IilDtoStatusEnum } from './../models/iil-dto';
export enum PageContext {
    Incoming = 0,
    Organizing,
    Focusing,
    Managing,
    Admin,
}

export const isOrganizeMode = (pageContext: PageContext) => {
    return pageContext === PageContext.Organizing;
  };

export const contextMapping: { [id: number] : string[]; } = {};
// context for editing
contextMapping[PageContext.Incoming] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING];
contextMapping[PageContext.Organizing] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING];
contextMapping[PageContext.Focusing] = [IilDtoStatusEnum.FOCUSED];
contextMapping[PageContext.Managing] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING, IilDtoStatusEnum.SETTLED, ];
contextMapping[PageContext.Admin] = [IilDtoStatusEnum.NOTINITIATED, IilDtoStatusEnum.ACTIVE, IilDtoStatusEnum.FOCUSED, IilDtoStatusEnum.PENDING, IilDtoStatusEnum.SETTLED, ];