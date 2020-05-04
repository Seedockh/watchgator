export const addPictureUrlSize = (url: string, width: number): string => {
    const urlParts = url.split('.')
    const ext = urlParts.pop();
    const urlWithoutExt = urlParts.join('.')
    return `${urlWithoutExt}._V1_UX${width}_.${ext}`;
}