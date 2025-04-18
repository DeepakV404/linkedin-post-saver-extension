
const BookmarkListButton = (props: {onButtonClick: () => void, applyPadding: any}) => {

    const { onButtonClick, applyPadding } =   props;

    return (
        <div
            style       =   {{paddingInlineStart: applyPadding ? "10px" : "0px", marginBottom: applyPadding ? "10px" : "14px"}}
            className   =   {`j-bookmark-list-button`}
            onClick     =   {() => {
                onButtonClick()
            }}
        >
            <div className="j-bookmark-list-button-inner">
                <img alt='Logo' src='https://static.buyerstage.io/static-assets/buyerstage-product-logo.svg' width={18} height={18}/>
                <div style={{fontSize: "12px", lineHeight: "20px"}}>View Saved Posts</div>
            </div>
        </div>
    )
}

export default BookmarkListButton