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

export const shuffleArray = (array: any[]) => {
  const tempArray = array;
  for (let i = tempArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }

  return tempArray;
};
