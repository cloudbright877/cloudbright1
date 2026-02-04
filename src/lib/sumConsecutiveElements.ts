export default function sumConsecutiveElements(arr: number[], groupSize: number): number[] {
  const result: number[] = [];
  
  // Iterate through the array in chunks of groupSize
  for (let i = 0; i < arr.length; i += groupSize) {
      const sum = arr.slice(i, i + groupSize).reduce((acc, num) => acc + num, 0);
      result.push(sum);
  }
  
  return result;
}


