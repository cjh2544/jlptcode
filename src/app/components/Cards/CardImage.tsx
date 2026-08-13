import React, { memo } from "react";
import Image from "next/image";

type ImageProps = {
  image: any;
};

const CardImage = (props: ImageProps) => {
  const { image } = props;
  const { name, link } = image || {};
  const src = typeof link === "string" ? link.trim() : "";

  if (!src) return null;

  return (
    <div>
      <Image
        src={src}
        alt={name || ""}
        width={400}
        height={400}
        style={{ width: "auto", height: "auto" }}
      />
    </div>
  );
};

export default memo(CardImage);
