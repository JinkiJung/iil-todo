import { IilDto } from "../../ill-repo-client";

export const validateIil = (iil: IilDto) => {
    if (iil.act && iil.act.length > 0) {
        return true;
    }
    return false;
}