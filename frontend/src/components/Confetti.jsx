import { useMemo } from 'react'
import { useConfetti } from '../context/AppContext'

const COLORS = ['#f0c040', '#ffffff', '#7c3aed', '#06b6d4', '#f472b6', '#34d399']
const SHAPES = ['50%', '0%', '30% 70% 70% 30% / 30% 30% 70% 70%']

export default function Confetti() {
  const { confettiActive } = useConfetti()

  const pieces = useMemo(() =>
    Array.from({ length: 64 }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,
      color:    COLORS[i % COLORS.length],
      width:    `${6 + Math.random() * 8}px`,
      height:   `${6 + Math.random() * 8}px`,
      borderRadius: SHAPES[i % SHAPES.length],
      animationDelay:    `${Math.random() * 1.2}s`,
      animationDuration: `${2.4 + Math.random() * 1.6}s`,
    })),
  [])

  if (!confettiActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left:              p.left,
            width:             p.width,
            height:            p.height,
            borderRadius:      p.borderRadius,
            background:        p.color,
            animationDelay:    p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  )
}
