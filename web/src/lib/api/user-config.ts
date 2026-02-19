
const API_URL = 'http://localhost:3001';

export const getUserConfig = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/config`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch config');
    return res.json();
};

export const updateUserConfig = async (config: any) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/users/config`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update config');
    return res.json();
};
