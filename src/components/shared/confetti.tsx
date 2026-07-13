"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  color: string
  rotation: number
}

const colors = ["#0D9488", "#F59E0B", "#14B8A6", "#FBBF24", "#3B82F6", "#EF4444"]

export function ConfettiOverlay({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!show) { requestAnimationFrame(() => setPieces([])); return }

    const newPieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }))

    const id = requestAnimationFrame(() => setPieces(newPieces))

    const timer = setTimeout(() => setPieces([]), 3000)
    return () => { clearTimeout(timer); cancelAnimationFrame(id) }
  }, [show])

  if (pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: "-10px",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
