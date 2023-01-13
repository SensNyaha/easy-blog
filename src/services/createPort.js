export default async function createPort (email) {
    let adminEmail = await fetchAdminEmail();
    if (adminEmail=== email) {
        return '660'
    }
    else {
        return '600'
    }
}

async function fetchAdminEmail() {
    let resp = await fetch(`http://localhost:3001/users?id=1`);
    let users = await resp.json();
    return users[0].email;
}