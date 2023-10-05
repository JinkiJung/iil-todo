import { IilDto } from "../../ill-repo-client";

// get abstract component for iil
export const getIilText = (iil: IilDto, noUserName: boolean = false): string => {
    return !noUserName ? ((iil.act?.name ?? "") + " by " + iil.actor) : (iil.act?.name ?? "");
}
