import createPort from "./createPort";

export default async function putPost (postId, email, token, body) {
    let port = await createPort(email);
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