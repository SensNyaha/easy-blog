export default function parseBlogText(text) {
    let regExp = new RegExp('<<.*>>','g');
    return text.split('\n').map((elem,i) => {
        if (regExp.test(elem)) {
            switch (elem.match(/(?<=<<).*(?=>>)/)[0]) {
                case ("subtitle"): 
                    return <h6 key={i} className="blog-post__subtitle">{elem.replace(regExp,'')}</h6>
                case ("img"):
                    return <img key={i} className="blog-post__photo" src={elem.replace(regExp,'')} alt="blog-post__photo" />
                case ("quote"):
                    return <div key={i} className="blog-post__quote">{elem.replace(regExp,'')}</div>
                case ("attention"):
                    return <div key={i} className="blog-post__attention">{elem.replace(regExp,'')}</div>
                default:
                    return <p key={i} className="blog-post__paragraph">{elem}</p>
            }
        }
        return <p key={i} className="blog-post__paragraph">{elem}</p>
    })
}