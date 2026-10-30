import type { ImgHTMLAttributes } from "react";

// Browser-side deterrents only: images displayed on the web cannot be made unsavable.
export default function ProtectedImage(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return (
    <span
      className="protected-image"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <img {...props} draggable={false} />
      <span className="image-copyright">
        © Ojesvi Dogra · All rights reserved
      </span>
    </span>
  );
}
