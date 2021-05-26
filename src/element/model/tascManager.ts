import Tasc from "../../model/tasc.entity";
import { TascState } from "../../type/tascState";
import { getRandomEmoji } from "../../util/emojiGenerator";

const shortid = require("shortid");

export const getBrandNewTasc = (
    goal: string,
    actor: string,
    ownerId: string,
    listSize: number
  ): Tasc => {
    return new Tasc({
      id: shortid.generate(),
      goal,
      actor,
      state: TascState.Active,
      ownedBy: ownerId,
      order: listSize,
      namespace: 'tasc-todo',
    });
  };

export const getBrandNewGoal = (): string => getRandomEmoji()+"=goal="+shortid.generate();

