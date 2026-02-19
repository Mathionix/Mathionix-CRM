"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email = 'admin@mathionixcrm.com';
const password = 'pass123';
async function testLogin() {
    console.log(`Attempting login for: ${email}`);
    try {
        const res = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log(`Status: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    }
    catch (e) {
        console.error('Error:', e);
    }
}
testLogin();
//# sourceMappingURL=test-login.js.map