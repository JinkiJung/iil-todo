import { IilDto } from "../../models";

export const validateIil = (iil: IilDto) => {
    if (iil.act && iil.act.length > 0) {
        if (iil.name && iil.name.length > 0) {
            return true;
        }
    }
    return false;
}