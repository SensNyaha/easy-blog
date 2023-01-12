export default function getCategories () {
    return fetch(`http://localhost:3001/categories`)
        .then(res=> res.json())
}