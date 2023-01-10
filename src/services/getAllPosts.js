export default function getAllPosts() {
    return fetch(`http://localhost:3001/posts`)
        .then(res=> res.json())
}