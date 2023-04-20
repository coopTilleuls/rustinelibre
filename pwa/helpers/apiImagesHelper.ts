import {ENTRYPOINT} from "../config/entrypoint";

export const apiImageUrl = (imagePath: string): string => {

    return ENTRYPOINT+imagePath;
}
