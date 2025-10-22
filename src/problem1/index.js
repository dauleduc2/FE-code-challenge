const validateInput = (n) => {
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0) {
    throw new Error(
      "Input must be a positive integer greater than or equal to 0."
    );
  }
};

const checkValidResult = (result) => {
  if (result > Number.MAX_SAFE_INTEGER) {
    throw new Error("Result exceeds Number.MAX_SAFE_INTEGER");
  }
};

// 1. Initialize an array of length n with incremental values by 1, then use reduce to sum them up.
const sum_to_n_a = function (n) {
  validateInput(n);
  const result = Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, val) => acc + val,
    0
  );
  checkValidResult(result);
  return result;
};

// 2. For loop
const sum_to_n_b = function (n) {
  validateInput(n);

  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;
  }

  checkValidResult(result);
  return result;
};

// 3. used the mathematical formula for summation: n * (n + 1) / 2
const sum_to_n_c = function (n) {
  validateInput(n);
  const result = (n * (n + 1)) / 2;
  checkValidResult(result);
  return result;
};

// Test all 3 methods with different inputs
for (const input of [-1, 0, 1.5, "10", 9999]) {
  console.log("Test with value:", input);

  for (const func of [sum_to_n_a, sum_to_n_b, sum_to_n_c]) {
    try {
      console.log(`Result from ${func.name}: ${func(input)}`);
    } catch (e) {
      console.log(`Error from ${func.name}: ${e.message}`);
    }
  }
  console.log("-------------------------------");
}
