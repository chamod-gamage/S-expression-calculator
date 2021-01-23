function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

function getInput() {
  return process.argv.slice(2)[0];
}

function splitArgs(data, l, r, delimiter, shouldReadForward) {
  let argumentList = [];
  let current = "";
  let depth = 0;
  let forward = shouldReadForward;
  let index = shouldReadForward ? l : r;

  while (
    forward === shouldReadForward &&
    ((shouldReadForward && index <= r) || (!shouldReadForward && index >= l))
  ) {
    if (data[index] === delimiter) {
      depth === 0 ? depth++ : (forward = !forward);
    } else if (data[index] === " ") {
      argumentList.push(current);
      current = "";
    } else {
      current = shouldReadForward
        ? current.concat(data[index])
        : data[index].concat(current);
    }
    index += shouldReadForward ? 1 : -1;
  }
  ((shouldReadForward && index > r) || (!shouldReadForward && index < l)) &&
    argumentList.push(current);

  let returnData = [argumentList, index];
  return returnData;
}

function readArgs(data) {
  if (typeof data === "object") {
    return data;
  }

  let args = [];
  let [left, l] = splitArgs(data, 0, data.length - 1, "(", true);
  let [right, r] =
    l >= data.length - 1
      ? [[], data.length - 1]
      : splitArgs(data, l, data.length - 1, ")", false);

  l <= r && left.push(readArgs(data.slice(l, r + 1)));
  args = left.concat(right);
  return args;
}

function calculate(command) {
  if (isNumber(command)) {
    return parseInt(command);
  }

  let base = {
    add: 0,
    multiply: 1,
  };
  let maxArgs = 3;

  let arguments = readArgs(command);

  if (arguments.length === 1) {
    if (isNumber(arguments[0])) {
      parseInt(arguments[0]);
    } else {
      return `Argument ${arguments[0]} is invalid.`;
    }
  } else if (arguments.length > maxArgs) {
    return `Too many arguments given for expression: ${command}`;
  }

  let operator = arguments.shift();
  let result = base[operator];

  switch (operator) {
    case "add":
      for (let i = 0; i < arguments.length; i++) {
        result += calculate(arguments[i]);
      }
      return parseInt(result);

    case "multiply":
      for (let i = 0; i < arguments.length; i++) {
        result *= calculate(arguments[i]);
      }
      return parseInt(result);

    default:
      console.log(
        "Unfortunately, we could not process that input. Please try again."
      );
  }
}

try {
  console.log(calculate(getInput()));
} catch (e) {
  console.log(e);
}
