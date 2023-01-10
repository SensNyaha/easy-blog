export default function parseBlogText(text) {
    let regExp = new RegExp('<<.*>>','g');
    return text.split('\n').map(elem => {
        if (regExp.test(elem)) {
            switch (elem.match(/(?<=<<).*(?=>>)/)[0]) {
                case ("subtitle"): 
                    return <h6 className="blog-post__subtitle">{elem.replace(regExp,'')}</h6>
                case ("img"):
                    return <img className="blog-post__photo" src={elem.replace(regExp,'')} alt="blog-post__photo" />
                case ("quote"):
                    return <div className="blog-post__quote">{elem.replace(regExp,'')}</div>
                case ("attention"):
                    return <div className="blog-post__attention">{elem.replace(regExp,'')}</div>
                default:
                    return <p className="blog-post__paragraph">{elem}</p>
            }
        }
        return <p className="blog-post__paragraph">{elem}</p>
    })
}