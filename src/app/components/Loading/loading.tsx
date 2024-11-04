import { memo } from "react";

type LoadingProps = {
    text?: string,
}

const Loading = (props:LoadingProps) => {

    const { text } = props;

    return (
        <>
            <p>{text ? text : 'Loading...'}</p>
        </>
    );
}

export default memo(Loading)