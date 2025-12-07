import React, { useEffect, useState } from "react";
import { Image } from "react-konva";
import type { LucideIcon } from "lucide-react";
import { createRoot } from "react-dom/client";

interface IconImageProps {
  IconComponent: LucideIcon;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

const IconImage: React.FC<IconImageProps> = ({
  IconComponent,
  x,
  y,
  width,
  height,
  color = "#2c3e50",
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const iconSize = Math.min(width, height) * 0.8;

  useEffect(() => {
    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = `${iconSize}px`;
    container.style.height = `${iconSize}px`;
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      React.createElement(IconComponent, {
        size: iconSize,
        color: color,
      })
    );

    setTimeout(() => {
      const svg = container.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setImage(img);
          URL.revokeObjectURL(svgUrl);
          document.body.removeChild(container);
          root.unmount();
        };
        img.src = svgUrl;
      } else {
        document.body.removeChild(container);
        root.unmount();
      }
    }, 50);

    return () => {
      if (container.parentNode) {
        document.body.removeChild(container);
        root.unmount();
      }
    };
  }, [IconComponent, iconSize, color]);

  if (!image) return null;

  return (
    <Image
      image={image}
      x={x + (width - iconSize) / 2}
      y={y + (height - iconSize) / 2}
      width={iconSize}
      height={iconSize}
    />
  );
};

export default IconImage;

