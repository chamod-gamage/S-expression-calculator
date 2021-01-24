let base = {
  add: 0,
  multiply: 1,
};
let maxArgs = 3;
let errorState = false;

function errors(err, variableStr) {
  errorState = true;
  switch (err) {
    case "invalid":
      return `Argument ${variableStr} is invalid.`;
    case "tooMany":
      return `Too many arguments given for expression: ${variableStr}`;
    default:
      return "Unfortunately, we could not process that. Please try again.";
  }
}

function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

function getInput() {
  return process.argv.slice(2)[0];
}

/*
  splits a substring into arguments, either reading forwards or backwards (according to parameters)
  returns an array containing:
    an array of arguments read at index 0 
    the index at which reading halted (due to encountering a bracket or terminus) at index 1
  */
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
    } else if (["(", ")"].includes(data[index])) {
      depth--;
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
  return [argumentList, index];
}

//recursive function reading all arguments given in a string
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

//parse and then calculate the value of a string containing expressions
function calculate(command) {
  if (isNumber(command)) {
    return parseInt(command);
  }

  if (errorState) {
    return command;
  }

  let arguments = readArgs(command);

  if (arguments.length === 1) {
    if (isNumber(arguments[0])) {
      return parseInt(arguments[0]);
    } else {
      return errors("invalid", arguments[0]);
    }
  } else if (arguments.length > maxArgs) {
    return errors("tooMany", command);
  }

  let operator = arguments.shift();
  let result = base[operator];

  switch (operator) {
    case "add":
      for (let i = 0; i < arguments.length; i++) {
        result += calculate(arguments[i]);
      }
      break;

    case "multiply":
      for (let i = 0; i < arguments.length; i++) {
        result *= calculate(arguments[i]);
      }
      break;
  }

  if (!errorState) {
    return parseInt(result);
  } else {
    return errors("default");
  }
}

console.log(calculate(getInput()));
