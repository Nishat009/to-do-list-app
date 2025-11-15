import Image from "next/image";

interface AuthIllustrationProps {
  src: any; 
  alt?: string;
  width?: number;
  height?: number;
}

export default function AuthIllustration({
  src,
  alt = "Illustration",
  width = 500,
  height = 600,
}: AuthIllustrationProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="max-w-full h-auto"
      priority
    />
  );
}
