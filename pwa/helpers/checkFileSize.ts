export const checkFileSize = (file: File): boolean => {

    const maxSize = 5 * 1024 * 1024; // (5 Mo)
    return file.size <= maxSize;
}
