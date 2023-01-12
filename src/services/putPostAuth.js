export default function putPost (postId, status, token, body) {
    let port = status === 'admin' ? '660' : '600';
    return fetch(`http://localhost:3001/${port}/posts/${postId}`,
            {   
                method: 'PUT',
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