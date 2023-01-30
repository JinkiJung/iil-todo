import { IilDto, IilDtoStateEnum } from '../../ill-repo-client';

export const getBrandNewIil = (
    actor: string,
    act: string,
    ownerId: string,
    id?: string,
    goal?: string,
    activateIf?: string,
    finishIf?: string,
    input?: string,
    output?: string,
  ): IilDto => {
    return {
      id,
      goal,
      about: {},
      activateIf,
      finishIf,
      actor,
      act,
      state: IilDtoStateEnum.NOTACTIVATED,
      owner: ownerId,
      input,
      output,
    };
  };

