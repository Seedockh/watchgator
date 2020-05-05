export const addPictureUrlSize = (url: string, width: number): string => {
    if (!url) return url;
    const urlParts = url.split('.')
    const ext = urlParts.pop();
    const urlWithoutExt = urlParts.join('.')
    return `${urlWithoutExt}._V1_UX${width}_.${ext}`;
}