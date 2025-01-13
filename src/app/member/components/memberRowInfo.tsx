'use client';
import React, {memo, MouseEvent} from "react";
import { format } from "date-fns";

type MemberRowInfoProps = {
  userInfo: User,
}

const MemberRowInfo = (props:MemberRowInfoProps) => {
  const { 
    userInfo, 
  } = props;

  return (
    <>
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm items-center whitespace-no-wrap">
          <p className="text-gray-900">
              {userInfo.name}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
          <p className="text-gray-900">
              {userInfo.email}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-no-wrap">
          <p className="text-gray-900">
              {format(userInfo.createdAt as string, 'yyyy-MM-dd HH:mm:ss')}
          </p>
        </td>
      </tr>
    </>
  );
}

export default memo(MemberRowInfo);
