import { useState } from 'react'

export default function Logo({ className = 'h-10 w-auto', textClass = 'text-white font-bold text-xl' }) {
  const [err, setErr] = useState(false)

  if (!err) {
    return (
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Impulso Latino"
          className={className}
          onError={() => setErr(true)}
        />
        <span className={textClass}>
          <span style={{color:'#ffffff'}}>Impulso </span>
          <span style={{color:'#EBA417'}}>Latino</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 48 48" className="h-10 w-10 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#14347B"/>
        {/* Star */}
        <polygon points="24,6 27.5,16.5 38.5,16.5 29.5,23 32.5,33.5 24,27 15.5,33.5 18.5,23 9.5,16.5 20.5,16.5" fill="#EBA417"/>
        {/* Arrow left */}
        <path d="M16 42 L22 18 L26 42 L22 38 Z" fill="#0077C8" opacity="0.9"/>
        {/* Arrow right */}
        <path d="M22 40 L27 20 L32 40 L27 36 Z" fill="white" opacity="0.8"/>
        {/* Gold swoosh */}
        <ellipse cx="24" cy="41" rx="10" ry="3" fill="#EBA417" opacity="0.7"/>
      </svg>
      <span className={textClass}>
        <span style={{color:'#ffffff'}}>Impulso </span>
        <span style={{color:'#EBA417'}}>Latino</span>
      </span>
    </div>
  )
}
