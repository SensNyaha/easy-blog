export default function getPostsAuth(start, end, status, token, userId) {
    let port = status === 'admin' ? '660' : '600';
    let endPath = status === 'admin' ? `?_start=${start}&_end=${end}` : `?userId=${userId}`;
    return fetch(`http://localhost:3001/${port}/posts${endPath}`,
        {headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}