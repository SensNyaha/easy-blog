import createPort from "./createPort";

export default async function deletePostAuth (postId, email, token) {
    let port = await createPort(email);
    return fetch(`http://localhost:3001/${port}/posts/${postId}`,
        {method: 'DELETE',
        headers:
            {
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(res=> res.json())
}