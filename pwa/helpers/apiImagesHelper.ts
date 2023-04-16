export const apiImageUrl = (imagePath: string): string => {

    return process.env.NEXT_PUBLIC_ENTRYPOINT+imagePath;
}
