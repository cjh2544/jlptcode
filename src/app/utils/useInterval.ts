import { useEffect, useRef } from "react";

const useInterval = (callback: any, delay: any) => {
	const savedCallback = useRef<any>();
    
    useEffect(() => {
    	savedCallback.current = callback;
    }, [callback]);
    
    useEffect(() => {
    	const tick = () => {
        savedCallback.current();
      }

      if (delay !== null) {
        let id = setInterval(tick, delay);
          return () => clearInterval(id);
      }
    }, [delay]);
}

export {useInterval}