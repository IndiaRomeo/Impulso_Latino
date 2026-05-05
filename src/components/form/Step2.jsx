function OptionCard({ label, value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
        selected
          ? 'border-secondary bg-secondary/5 text-secondary'
          : 'border-gray-200 hover:border-gray-300 text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

export default function Step2({ data, update, onNext, onBack }) {
  const valid = data.trabajando && data.ingresos && (data.trabajando === 'No' || data.tipoTrabajo)

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-1">Situación Laboral</h2>
      <p className="text-gray-500 mb-6">Necesitamos entender tu situación de trabajo.</p>

      <div className="space-y-6">
        <div>
          <label className="label">¿Actualmente estás trabajando?</label>
          <div className="grid grid-cols-2 gap-3">
            {['Sí', 'No'].map(v => (
              <OptionCard key={v} label={v} value={v} selected={data.trabajando === v} onClick={val => update('trabajando', val)} />
            ))}
          </div>
        </div>

        {data.trabajando === 'Sí' && (
          <div>
            <label className="label">¿Qué tipo de trabajo tienes?</label>
            <div className="space-y-2">
              {['Tiempo completo', 'Medio tiempo', 'Independiente / Self-employed'].map(v => (
                <OptionCard key={v} label={v} value={v} selected={data.tipoTrabajo === v} onClick={val => update('tipoTrabajo', val)} />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="label">¿Cuáles son tus ingresos mensuales aproximados?</label>
          <div className="space-y-2">
            {['$1,000 – $2,000', '$2,000 – $3,000', '$3,000 – $5,000', '$5,000+'].map(v => (
              <OptionCard key={v} label={v} value={v} selected={data.ingresos === v} onClick={val => update('ingresos', val)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all">
          ← Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
            valid ? 'btn-cta' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
