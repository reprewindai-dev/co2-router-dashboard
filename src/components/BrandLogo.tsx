type BrandLogoProps = {
  variant?: 'mark' | 'wordmark'
  className?: string
  alt?: string
}

export function BrandLogo({
  variant = 'wordmark',
  className = '',
  alt = 'CO2 Router',
}: BrandLogoProps) {
  const src = variant === 'mark' ? '/co2router-mark.svg' : '/co2router-wordmark.svg'

  return <img src={src} alt={alt} className={className} />
}
