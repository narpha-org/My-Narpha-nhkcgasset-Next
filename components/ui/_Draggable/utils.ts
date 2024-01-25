export function moveItem<T = any>(
  arr: T[],
  currentIndex: number,
  targetIndex: number
) {
  const targetItem = arr[currentIndex];
  let resArr = arr.map((target, i) => (i === currentIndex ? null : target));
  resArr.splice(targetIndex, 0, targetItem);
  return resArr.flatMap((target) => (target !== null ? [target] : []));
}
