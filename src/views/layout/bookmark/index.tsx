
const BookMarkButton = (props: { onButtonClick: () => void }) => {

    const { onButtonClick } =   props;

    return (
        <button
            style={{
                alignItems: "center",
                display: "flex",
                whiteSpace: "nowrap",
                gap: "4px",
                padding: "0px 4px",
            }}
            onClick     =   {() => {
                onButtonClick()
            }}
        >
            <img alt='Logo' src='https://static.buyerstage.io/static-assets/buyerstage-product-logo.svg' width={20} height={20}/>
            <div style={{fontSize: "13px"}}>Save Post</div>
        </button>
    )
}

export default BookMarkButton