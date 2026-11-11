export type CapybaraState = 'idle' | 'running' | 'jumping' | 'attacking' | 'collecting' | 'climbing' | 'crouching';

export default function Capybara({ 
  size = 64, 
  className = '',
  state = 'idle'
}: { 
  size?: number, 
  className?: string,
  state?: CapybaraState
}) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`state-${state}`}
        style={{ overflow: 'visible' }}
      >
        {/* Sombra (stays on ground) */}
        <ellipse cx="50" cy="88" rx="40" ry="8" fill="rgba(0,0,0,0.2)" className="capy-shadow" />

        <g className="capy-body">
          {/* Pernas traseiras (Back details, drawn behind body) */}
          <path className="capy-leg capy-leg-bl" d="M 25 60 L 25 85 L 35 85 L 35 60" fill="#a46d3f" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path className="capy-leg capy-leg-br" d="M 65 60 L 65 85 L 75 85 L 75 60" fill="#a46d3f" stroke="#000" strokeWidth="4" strokeLinejoin="round" />

          {/* Corpo torto */}
          <path d="M 15 35 C 10 15, 30 15, 60 20 C 80 22, 98 35, 96 50 C 94 70, 85 75, 55 75 C 25 75, 18 65, 15 35 Z" fill="#cf8a52" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>

          {/* Pernas da frente (Front details, drawn over body) */}
          <path className="capy-leg capy-leg-fl" d="M 35 65 L 35 90 L 45 90 L 45 65" fill="#cf8a52" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path className="capy-leg capy-leg-fr" d="M 80 55 L 80 90 L 90 90 L 90 55" fill="#cf8a52" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          
          {/* Orelha */}
          <path d="M 52 18 C 45 8, 62 8, 60 18 Z" fill="#cf8a52" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
          
          {/* Focinho retangular */}
          <path d="M 75 35 C 105 35, 105 60, 80 60" fill="#b0703e" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
          
          {/* Nariz */}
          <ellipse cx="94" cy="42" rx="4" ry="7" fill="#4d2f1d" />

          {/* Olhos estilo Clarencio - um maior q o outro */}
          <circle cx="68" cy="30" r="10" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
          <circle cx="82" cy="28" r="7" fill="#FFFFFF" stroke="#000" strokeWidth="4" />
          
          {/* Pupilas encarando o vazio */}
          <circle cx="70" cy="30" r="2.5" fill="#000" />
          <circle cx="84" cy="28" r="2" fill="#000" />

          {/* Bochecha */}
          <circle cx="65" cy="45" r="6" fill="#f472b6" opacity="0.6"/>

          {/* Sorrisinho e boca */}
          <g className="capy-mouth">
            <path d="M 85 55 Q 92 65 95 53" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
