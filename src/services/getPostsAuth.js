import createPort from "./createPort";

export default async function getPostsAuth(email, token, userId) {
    let port = await createPort(email)
    let endPath = port === '660' ? `` : `?userId=${userId}`;
    return fetch(`http://localhost:3001/${port}/posts${endPath}`,
        {headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}