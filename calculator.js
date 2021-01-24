function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

function getInput() {
  return process.argv.slice(2)[0];
}

function splitArgs(data) {
  if (typeof data === "object") {
    return data;
  }

  let depth = 0;
  let args = [];
  let left = [];
  let right = [];
  let current = "";
  let l = 0;
  let r = data.length - 1;
  let forward = true;

  while (forward && l <= r) {
    if (data[l] === "(") {
      depth === 0 ? depth++ : (forward = false);
    } else if (data[l] === " ") {
      left.push(current);
      current = "";
    } else {
      current = current.concat(data[l]);
    }
    l++;
  }
  current.length && left.push(current);
  current = "";
  depth = 0;
  while (!forward && l <= r) {
    if (data[r] === ")") {
      depth === 0 ? depth++ : (forward = true);
    } else if (data[r] === " ") {
      right.push(current);
      current = "";
    } else {
      current = data[r].concat(current);
    }
    r--;
  }

  l <= r && left.push(splitArgs(data.slice(l, r + 1)));
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

  let arguments = splitArgs(command);

  if (arguments.length === 1) {
    if (isNumber(arguments[0])) {
      parseInt(arguments[0]);
    } else {
      return "Argument invalid.";
    }
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
