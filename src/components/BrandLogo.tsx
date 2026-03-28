type BrandLogoProps = {
  variant?: 'full' | 'icon'
  className?: string
  alt?: string
}

export function BrandLogo({
  variant = 'full',
  className = '',
  alt = 'CO2 Router',
}: BrandLogoProps) {
  const src = variant === 'icon' ? '/co2router-symbol.png' : '/co2router-logo.png'

  return <img src={src} alt={alt} className={className} decoding="async" draggable="false" />
}
