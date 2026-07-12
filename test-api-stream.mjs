async function main() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] })
    });
    console.log('Status:', res.status);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: isDone } = await reader.read();
      if (value) {
        console.log('Chunk:', decoder.decode(value));
      }
      done = isDone;
    }
  } catch(e) {
    console.error(e);
  }
}
main();
