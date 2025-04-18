
const PostLoading = () => {
    return (
        <div style={{display: "flex", columnGap: "10px"}} className='j-post-card'>
            <div className="j-skeleton-image"></div>
            <div className="j-skeleton-text">
                <div className="j-skeleton-line title"></div>
                <div className='bs-padding-top15' style={{display: "flex", flexDirection: "column", rowGap: "8px"}}>
                    <div className="j-skeleton-line content"></div>
                    <div className="j-skeleton-line content"></div>
                    <div className="j-skeleton-line content"></div>
                    <div className="j-skeleton-line content" style={{width: "120px"}}></div>
                </div>
            </div>
        </div>
    )
}

export default PostLoading