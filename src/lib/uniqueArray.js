
const uniqueArray = (array, key) => {
    const map = new Map();
    array.forEach((item) => {
      if (!map.has(item[key])) {
        map.set(item[key], item);
      }
    });
    return [...map.values()];
  };
  

export default uniqueArray;