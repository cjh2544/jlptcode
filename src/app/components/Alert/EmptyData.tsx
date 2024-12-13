import { Spinner, Typography } from "@material-tailwind/react";
import { memo } from "react";

type LoadingProps = {
    text?: string,
    className?: string
}

const EmptyData = (props:LoadingProps) => {

    const { text, className } = props;

    return (
        <div className={`p-4 text-sm bg-white ${className}`}>
            {text || '등록된 정보가 없습니다.'}
        </div>
    );
}

export default memo(EmptyData)