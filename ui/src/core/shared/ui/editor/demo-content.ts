export const DEMO_CONTENT = `
<h1>Issue Report: Proposal - Safe Assignment Operator</h1>
<p></p>
<p>This proposal introduces a new operator, ?= (Safe Assignment), which simplifies error handling by transforming the result of a function into a tuple. If the function throws an error, the operator returns [error, null]; if the function executes successfully, it returns [null, result]. This operator is compatible with promises, async functions, and any value that implements the Symbol.result method.</p>
<p></p>
<p>For example, when performing I/O operations or interacting with Promise-based APIs, errors can occur unexpectedly at runtime. Neglecting to handle these errors can lead to unintended behavior and potential security vulnerabilities.</p>
<pre>
<code>async function getData() {
  const response = await fetch("https://api.example.com/data")
  const json = await response.json()
  return validationSchema.parse(json)
}</code>
</pre>
`;
