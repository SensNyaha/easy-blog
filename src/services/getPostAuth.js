export default function getPost (postId, status, token) {
    let port = status === 'admin' ? '660' : '600';
    return fetch(`http://localhost:3001/${port}/posts?id=${postId}`,
        {headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}