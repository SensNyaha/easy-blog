export default function getPost (postId) {
    return fetch(`http://localhost:3001/posts?id=${postId}`)
        .then(res=> res.json())
}