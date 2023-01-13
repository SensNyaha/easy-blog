import createPort from "./createPort";

export default async function getPostsAuth(email, token, userId) {
    let port = await createPort(email)
    let endPath = port === '660' ? `/${port}/posts` : `/posts?userId=${userId}`;
    return fetch(`http://localhost:3001${endPath}`,
        {headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}