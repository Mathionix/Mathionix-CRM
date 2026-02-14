
fetch('http://localhost:3001/crm/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        type: "Note",
        title: "Test Note",
        content: "This is a test note content",
        meta: { some: "data" }
    })
}).then(res => res.json()).then(console.log).catch(console.error);
