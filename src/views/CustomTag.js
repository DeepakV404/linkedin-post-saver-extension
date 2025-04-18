import { Tag } from "antd";

const COLOR_CODES = {

    red : {
        background: "#ffd9d94a",
        color: "#f16063",
        borderColor: "#ffd9d94a"
    },

    blue:  {
        background: "#8aafff40",
        color: "#057dd3",
        borderColor: "#8aafff400"
    },

    green: {
        background: "#d8f4d88f",
        color: "#008000",
        borderColor: "#d8f4d88f"
    },

    paleGreen: {
        background: "#e0fff7",
        color: "#00c998",
        borderColor: "#e0fff76"
    },

    grey: {
        background: "#f2f2f2",
        color: "#666666",
        borderColor: "#f2f2f2"
    },

    yellow:{
        background: "#ffe28347",
        color: "#ca9b00",
        borderColor: "#ffe283477"
    },

    orange: {
        background: "#fff3ec",
        color: "#fb914d",
        borderColor: "#fff3ec"
    },

    pink: {
        background: "#ffeaf8",
        color: "#df47aa",
        borderColor: "#ffeaf8"
    },

    purple: {
        background: "#ffeeff",
        color: "#c028c0",
        borderColor: "#ffeeff"
    },
    paleBlue: {
        background: "#daf4ff",
        color: "#0075a4",
        borderColor: "#daf4ff"
    }

}

export const CustomTag = (props) => {

    const { color, children } = props;

    return (
        <Tag style={COLOR_CODES[color]}>{children}</Tag>
    )
}
