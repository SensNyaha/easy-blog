export default function getPosts(start, end) {
    return fetch(`http://localhost:3001/posts?_start=${start}&_end=${end}`)
        .then(res=> res.json())
}