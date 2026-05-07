const axios = require('axios');

async function test() {
  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: "grok-4.3",
        messages: [{ role: "user", content: "hello" }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer xai-sUSE2uKpneyRN6lUWELcnExXVYKFRb4tx4mpYquc0ZWPR2lqFBRsFENuLgcwj6WLyx5OLgAGuvRob8IF`,
        },
      }
    );
    console.log("Success:", response.data);
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
}
test();
