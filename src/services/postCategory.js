export default function postCategory(body) {
    return fetch('http://localhost:3001/categories', {
        method: "POST",
        body: JSON.stringify(body),
        headers:{'Content-type': 'application/json'}
    }).then(res => res.json())
}