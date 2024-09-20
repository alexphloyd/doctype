export const PROPOSAL_TEMPLATE = `
  <h1>Proposal Report: Introducing the Safe Assignment Operator (?=)</h1><p>We're excited to introduce a new JavaScript operator: <strong>?= (Safe Assignment)</strong>. This operator is designed to streamline error handling by automatically transforming function results into a tuple. In cases where a function encounters an error, the operator returns <code>[error, null]</code>. If the function executes successfully, it returns <code>[null, result]</code>.</p><h3>Key Features</h3><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Primary Task</p><ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked="checked"><span></span></label><div><p>sub-task</p></div></li></ul></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Secondary Task Pending</p></div></li></ul><pre><code>async function getData() {
    const response = await fetch("https://api.example.com/data");
    const json = await response.json();
    return validationSchema.parse(json);
}</code></pre><p>Stay tuned as we explore the potential of the Safe Assignment Operator to simplify error handling in JavaScript, making your code more resilient and easier to maintain.</p>
  `;
