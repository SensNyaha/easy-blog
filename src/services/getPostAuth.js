import createPort from "./createPort";

export default async function getPost (postId, email, token) {
    let port = await createPort(email);
    console.log(port)
    return fetch(`http://localhost:3001/${port}/posts?id=${postId}`,
        {headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}