import { IilDto, IilDtoStatusEnum } from '../../ill-repo-client';

export const getBrandNewIil = (
    emoji: string,
    actor: string,
    act: string,
    ownerId: string,
    id?: string,
    goal?: string,
    startIf?: string,
    endIf?: string,
    input?: string,
    output?: string,
  ): IilDto => {
    return {
      id,
      goal,
      describe: {'emoji': emoji},
      startIf,
      endIf,
      actor,
      act,
      status: IilDtoStatusEnum.NOTSTARTED,
      owner: ownerId,
      input,
      output,
    };
  };

