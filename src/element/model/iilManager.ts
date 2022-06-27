import { IilDtoStatusEnum } from './../../models/iil-dto';
import { IilDto } from "../../models";
import { getRandomEmoji } from "../../util/emojiGenerator";

export const getBrandNewIil = (
    name: string,
    actor: string,
    act: string,
    ownerId: string,
    id?: string,
  ): IilDto => {
    return {
      id,
      name,
      startWhen: '',
      endWhen: '',
      actor,
      act,
      createdBy: ownerId,
      status: IilDtoStatusEnum.NOTINITIATED,
      ownedBy: ownerId,
    };
  };

export const getBrandNewName = (): string => getRandomEmoji();

