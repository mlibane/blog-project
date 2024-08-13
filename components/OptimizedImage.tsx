import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, width, height, className }) => {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        quality={75}
      />
    </div>
  )
}

export default OptimizedImage