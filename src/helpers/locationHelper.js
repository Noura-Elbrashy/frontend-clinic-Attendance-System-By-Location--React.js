// // بتحسب المسافة بين نقطتين حسب الإحداثيات
// export const isInsideLocation = (targetLat, targetLng, currentLat, currentLng, maxDistanceInMeters = 100) => {
//   const toRad = (value) => (value * Math.PI) / 180;

//   const R = 6371000; // نصف قطر الأرض بالمتر
//   const dLat = toRad(currentLat - targetLat);
//   const dLng = toRad(currentLng - targetLng);

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(targetLat)) *
//       Math.cos(toRad(currentLat)) *
//       Math.sin(dLng / 2) *
//       Math.sin(dLng / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c;

//   return distance <= maxDistanceInMeters;
// };
// بتحسب المسافة بين نقطتين حسب الإحداثيات
export const isInsideLocation = (targetLat, targetLng, currentLat, currentLng, maxDistanceInMeters = 100) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371000; // نصف قطر الأرض بالمتر
  const dLat = toRad(currentLat - targetLat);
  const dLng = toRad(currentLng - targetLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(targetLat)) *
      Math.cos(toRad(currentLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= maxDistanceInMeters;
};