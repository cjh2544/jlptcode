import React, { memo } from "react";

type ImageProps = {
  image: any;
};

function toDisplaySrc(src: string) {
  if (/^https?:\/\//i.test(src)) {
    return `/api/image?url=${encodeURIComponent(src)}`;
  }
  return src;
}

const CardImage = (props: ImageProps) => {
  const { image } = props;
  const { name, link } = image || {};
  const src = typeof link === "string" ? link.trim() : "";

  if (!src) return null;

  return (
    <div className="app-question-media">
      <img
        src={toDisplaySrc(src)}
        alt={name || ""}
        className="app-question-image"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default memo(CardImage);
