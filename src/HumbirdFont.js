const BuyerstageFont = ({ font, size ="24px", color }) => {

    return <span className={`bs-font hf-${font}`} style={{ fontSize: size, color: color}}></span>
}

export default BuyerstageFont