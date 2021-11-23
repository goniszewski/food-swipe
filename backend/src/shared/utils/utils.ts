export const chunk = (arr: any[], size = 1) => {
  size = Math.max(Math.round(size), 0);
  const length = arr == null ? 0 : arr.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = arr.slice(index, (index += size));
  }
  return result;
};
