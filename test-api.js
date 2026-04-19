async function run() {
  const res = await fetch('http://localhost:3000/api/founder/technologies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Testing 101',
      subtitle: 'hello',
      trl: 5,
      patentStatus: 'Filed'
    })
  });
  console.log(res.status, await res.text());
}
run();
