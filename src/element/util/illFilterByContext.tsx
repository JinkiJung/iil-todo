import { IilDtoStatusEnum } from "../../models";
import { contextMapping, PageContext } from "../../type/pageContext";

export const isStatusFitToContext = (givenContext: PageContext, status: IilDtoStatusEnum) => contextMapping[givenContext].includes(status);