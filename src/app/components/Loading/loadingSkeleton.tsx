import { Spinner, Typography } from "@material-tailwind/react";
import { memo } from "react";

type LoadingProps = {
    text?: string,
}

const LoadingSkeleton = (props:LoadingProps) => {

    const { text } = props;

    return (
        <div className="w-full bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 animate-pulse md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-2.5 bg-gray-400 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-gray-400 rounded-full w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-400 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-gray-400 rounded-full w-12"></div>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-400 rounded-full w-24 mb-2.5"></div>
                    <div className="w-32 h-2 bg-gray-300 rounded-full"></div>
                </div>
                <div className="h-2.5 bg-gray-400 rounded-full w-12"></div>
            </div>
            <span className="sr-only">{text || 'Loading...'}</span>
        </div>
    );
}

export default memo(LoadingSkeleton)