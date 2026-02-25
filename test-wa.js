const fetch = require('node-fetch');
async function test() {
  const token = 'EAAZBVuCY26iQBQwcwR6NC1TzglvOgQqC3zcifZCpYCcfiu5ZCZAlZAyBWX8k6Ijh555ZBl7ZAUCFHPcqosK9ix6Yf8sQ4qKI4ZCuV7qOnSYzmtJQSSZCFK0J54bhk5zTgxrDqC2OvHXuBYTuqpSG39gebDYGGFf9kEXjUZAXN7113c1kpbgLXZBLPIdCPJZCEnyqlgZDZD';
  const phoneId = '897582306782907';
  const res = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: '15551234567', // REPLACE WITH REAL NUMBER TO TEST PROPERLY. OR CAN JUST TEST ERRORS.
      type: 'text',
      text: { body: 'test message' }
    })
  });
  console.log(await res.json());
}
test();
