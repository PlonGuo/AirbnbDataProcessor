# Airbnb Data Processor

## Project Overview

The Airbnb Data Processor is designed to process Airbnb data from a CSV file. It filters listings based on user-defined criteria, computes statistics such as the total number of listings and average price per room, and generates a ranking of hosts by the number of listings they own.

---

## How to run the program (Make sure you have Node.js and npm installed)

1. **Install all the dependencies first by typing following command**

```zsh
npm install
```

2. **Run the program**

```zsh
node cli.js
```

---

## Tools and Technologies Used

- **JavaScript (ES6+)**: For functional programming with array methods like `map`, `filter`, and `reduce`.
- **Node.js (fs/promises)**: For asynchronous file handling.
- **JSDoc**: For comprehensive documentation and maintaining readable code.
- **CSV-Parser**: For parsing CSV data efficiently.
- **Vercel**: For deployment and managing environment variables securely.

---

## Method Chaining and Functional Programming

This project uses method chaining extensively for better readability and flow. Functions like `filterListings`, `computeStatistics`, and `computeHostRanking` are chained to process the data in a streamlined manner. Array functions such as `map`, `filter`, and `reduce` are used for efficient data manipulation.

---

## GenAI Usage

- **Prompt1**:
  - "How do I read a CSV file in JS?""
- **Prompt2**:
  - "How do I read a GZ file in JS?"
- **Prompt3**:
  - "How do I read a ZIP file in JS?"
- **Prompt4**:
  - "Please give me an example of using reduce() in JS to calculate the average of an array of numbers."
- **Prompt5**:
  "Could you tell me how to parses a price string and converts it to a float?"

**Debugging Process**: The initial version required several iterations. I learned to provide more detailed prompts, specifying the desired outputs and the data flow. This improved the accuracy of the generated code.

**What I Learned**: Using GenAI helped me understand the importance of clear and precise prompts. It also demonstrated the efficiency of breaking down complex tasks into smaller, manageable parts. Additionally, I learned to critically evaluate the generated code, enhancing my debugging and problem-solving skills.

---

## Challenges and Lessons Learned

- **Challenges**: Implementing method chaining while maintaining clear and readable code was challenging. Debugging the chained methods, especially with asynchronous data loading, was also a complex task.
- **Lessons Learned**: This project enhanced my understanding of advanced JavaScript concepts, including method chaining and functional programming. It also emphasized the importance of maintaining comprehensive documentation with JSDoc.

---

## 2. Counter Example for Pure Functions and Higher-Order Functions

In functional programming, **pure functions** and **higher-order functions** are fundamental principles. This section provides a counter example to illustrate what kind of code would break these principles.

---

## 3. Youtube Video Link

[https://https://www.youtube.com/watch?v=JfgFJUrEVeA](https://www.youtube.com/watch?v=JfgFJUrEVeA)

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

## Higher-Order Function Counter Example

```js
const createBrokenCounter = (initialValue = 0) => {
  let count = initialValue;

  // Broken because it doesn't return a function
  count++;
  return count;
};

const counter = createBrokenCounter();
console.log(counter); // 1
console.log(counter); // 1 (It doesn't actually count)
```
