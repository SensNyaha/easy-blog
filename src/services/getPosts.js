export default function getPosts() {
    return fetch('http://localhost:3001/posts')
        .then(res=> res.json())
}