import { Spinner, Typography } from "@material-tailwind/react";
import { memo } from "react";

type LoadingProps = {
    text?: string,
}

const Loading = (props:LoadingProps) => {

    const { text } = props;

    return (
        <div className="max-w-full p-4 mx-auto grid h-56 place-content-center justify-items-center">
            <Spinner className="h-8 w-8" />
            <Typography className="animate-pulse" variant="h4">{text ? text : 'Loading...'}</Typography>
        </div>
    );
}

export default memo(Loading)