export const getDistanceFromLatLngInKm = (
  lat1: number,
  lng1: number,
  lat2: string | null,
  lng2: string | null
): number => {
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  const newLat = lat2 ? +lat2 : 37.5665;
  const newLng = lng2 ? +lng2 : 126.978;

  const R = 6371;
  const dLat = deg2rad(newLat - lat1);
  const dLng = deg2rad(newLng - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(newLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.floor(distance);
};
