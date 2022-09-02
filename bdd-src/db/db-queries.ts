export const writeCoordinatesToDbQuery = (
  addressId: number,
  latCol: string,
  lonCol: string,
  lat: number,
  lon: number
) =>
  `UPDATE addresses SET ${latCol}=${lat}, ${lonCol}=${lon} WHERE id=${addressId}`;

export const writeCorrectToDbQuery = (
  addressId: number,
  correct: boolean,
  error: string
) => {
  const query = `update addresses set ${
    error ? `error='${error}',` : ""
  } correct='${correct}' where id=${addressId}`;
  console.log(query);
  return query;
};

export const finishAddressFeature = (addressId: number) =>
  `update addresses set updated_date=now(), processing=false, processed=true where id=${addressId}`;
