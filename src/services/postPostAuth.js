export default async function postPostAuth (email, token, body) {
    return fetch(`http://localhost:3001/${660}/posts`,
            {   
                method: 'POST',
                body: JSON.stringify(body),
                headers:
                {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(res=> res.json())
}