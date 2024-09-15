export const PROPOSAL_TEMPLATE = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Proposal Report: Introducing the Safe Assignment Operator (?=)',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: "We're excited to introduce a new JavaScript operator: " },
        { type: 'text', marks: [{ type: 'bold' }], text: '?= (Safe Assignment)' },
        {
          type: 'text',
          text: '. This operator is designed to streamline error handling by automatically transforming function results into a tuple. In cases where a function encounters an error, the operator returns ',
        },
        { type: 'text', marks: [{ type: 'code' }], text: '[error, null]' },
        { type: 'text', text: '. If the function executes successfully, it returns ' },
        { type: 'text', marks: [{ type: 'code' }], text: '[null, result]' },
        {
          type: 'text',
          text: '. This approach is especially useful when dealing with promises, async functions, or any value that implements the ',
        },
        { type: 'text', marks: [{ type: 'code' }], text: 'Symbol.result' },
        { type: 'text', text: ' method.' },
      ],
    },
    { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Key Features' }] },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Primary Task Completed' }] },
          ],
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Secondary Task Pending' }] },
          ],
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: { language: null },
      content: [
        {
          type: 'text',
          text: 'async function getData() {\n  const response = await fetch("https://api.example.com/data");\n  const json = await response.json();\n  return validationSchema.parse(json);\n}',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Stay tuned as we explore the potential of the Safe Assignment Operator to simplify error handling in JavaScript, making your code more resilient and easier to maintain.',
        },
      ],
    },
  ],
};
