"use client"

import Image from "next/image"
import { useState } from "react"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackText?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill,
  className,
  fallbackText,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className ?? ""}`}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">{fallbackText ?? alt?.[0]?.toUpperCase() ?? "?"}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      onError={() => setError(true)}
    />
  )
}
