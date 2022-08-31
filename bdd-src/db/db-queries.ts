export const wirteCoordinatedToDbQuery = (
    addressId: number,
    latCol: string,
    lonCol: string,
    lat: number, 
    lon: number
) => 
    `UPDATE addresses SET ${latCol}=${lat}, ${lonCol}=${lon} WHERE id=${addressId}`;