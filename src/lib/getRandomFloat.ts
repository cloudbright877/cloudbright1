export default function getRandomFloat(min: number, max : number, decimals : number) {
  if (min > max) {
    throw new Error("Parameter 'min' cannot be greater than 'max'");
  }
  if (decimals < 0) {
    throw new Error("Parameter 'decimals' must be a non-negative integer");
  }

  const random = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff; 
  const scaled = random * (max - min) + min; 
  const factor = Math.pow(10, decimals);
  return Math.round(scaled * factor) / factor;
}