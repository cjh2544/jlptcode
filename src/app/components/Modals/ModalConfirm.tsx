import React, { memo, useMemo } from "react";
import CheckInfoIcon from "../Icons/CheckInfo";
import CheckWarningIcon from "../Icons/CheckWarning";
import CheckErrorIcon from "../Icons/CheckError";

type ModalConfirmProps = {
  type?: 'info' | 'error' | 'warning',
  title?: string,
  message: any,
  visible: boolean,
  onClose: (visible: boolean) => void
}

const ModalConfirm = (props: ModalConfirmProps) => {
  const {type = 'info', title, message, visible=false, onClose} = props;

  const colorInfo = useMemo(
    () => {
      return {
        info: 'blue',
        warning: 'orange',
        error: 'red',
      }[type as string]
    },
    [type]
  );

  const handleClose = () => {
    onClose && onClose(false);
  }

  return (
    <>
      <div className={`${visible ? '' : 'hidden'} backdrop-blur-md drop-shadow-lg fixed inset-0 px-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]`}>
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 relative mx-auto text-center">
              {
                {
                  info: <CheckInfoIcon />,
                  warning: <CheckWarningIcon />,
                  error: <CheckErrorIcon />,
                }[type as string]
              }

              <div className="mt-12">
                  <h3 className="text-gray-800 text-2xl font-bold flex-1">{title || '확인!'}</h3>
                  <p className="text-sm text-gray-600 mt-3">{message}</p>

                  <button onClick={() => handleClose()} type="button"
                      className={`px-6 py-2.5 mt-8 w-full rounded-md text-white text-sm font-semibold tracking-wide border-none outline-none bg-${colorInfo}-500 hover:bg-${colorInfo}-600`}>확인</button>
              </div>
          </div>
      </div>
    </>
  );
}

export default memo(ModalConfirm);