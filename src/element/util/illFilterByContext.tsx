
import { IilDtoStateEnum } from "../../ill-repo-client";
import { contextMapping, PageContext } from "../../type/pageContext";

export const isStatusFitToContext = (givenContext: PageContext, status: IilDtoStateEnum) => contextMapping[givenContext].includes(status);