//Keep track of all the keys we've generated to ensure uniqueness
let usedKeys: Array<string> = [];

//Generates a random key
const keyGenerator = (): string => {
  return `portalize_${Math.random().toString(36).substr(2, 16)}-${Math.random()
    .toString(36)
    .substr(2, 16)}-${Math.random().toString(36).substr(2, 16)}`;
};

//Custom hook that checks for uniqueness and retries if clashes
export const useGeneratedKey = (): string => {
  let foundUniqueKey = false;
  let newKey = '';
  let tries = 0;
  while (!foundUniqueKey && tries < 3) {
    //limit number of tries to stop endless loop of pain
    tries++;
    newKey = keyGenerator();
    if (!usedKeys.includes(newKey)) {
      foundUniqueKey = true;
    }
  }
  //will only run if exited while loop without finding a unique key
  if (!foundUniqueKey) {
    newKey = `portalize_${Date.now()}_${Math.floor(Math.random() * 1000)}`; //fallback method
  }

  usedKeys.push(newKey);
  return newKey;
};

//Removes our key to make it 'available' again
export const removeKey = (key: string): null => {
  usedKeys = usedKeys.filter(k => k !== key);
  return null;
};
