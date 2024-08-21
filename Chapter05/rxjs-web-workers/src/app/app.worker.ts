/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { iterations } = data;
  let previousResult: number | null = 0;

  for (let i = 0; i < iterations; i++) {
    // Heavy computation
    let result;

    if (i % 5 === 0) {
      result = null; // Emit the previous value
    } else if (i % 10 === 0) {
      result = previousResult; // Emit the same value
    } else {
      result = i * 2; // Emit double value
    }

    // Post the result back to the main thread
    postMessage(result);
    previousResult = result;
  }  
});