# Homework 3: Functional Programming

---

## 1. Functionality Overview

This homework is about practicing functional programming concepts using JavaScript.
The project processes Airbnb listings data with the following functionalities:

- **Filter listings** based on price, number of rooms, or review score.
- **Compute statistics** such as the number of filtered listings and average price per number of rooms.
- **Rank hosts** by the number of listings.
- **Export results** to a user-specified file.

This project uses:

- **Pure Functions** and **Higher-Order Functions**
- **Array Functions**: `map`, `filter`, `reduce`
- **Promises and node:fs/promises** for asynchronous file operations
- **ES Modules** and **JSDoc** for documentation

---

## 2. Counter Example for Pure Functions and Higher-Order Functions

In functional programming, **pure functions** and **higher-order functions** are fundamental principles. This section provides a counter example to illustrate what kind of code would break these principles.

---

## Pure Function Counter Example

```js
// External mutable state
let total = 0;

/**
 * This is NOT a pure function because it modifies the external state `total`.
 * It also does not return a new value.
 * @param {number[]} numbers - An array of numbers
 */
const addToTotal = (numbers) => {
  numbers.forEach((num) => {
    total += num;
  });
};

addToTotal([1, 2, 3]);
console.log(total); // Output: 6
```
