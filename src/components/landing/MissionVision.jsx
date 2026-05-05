import { Target, Eye } from 'lucide-react'

export default function MissionVision() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">Quiénes somos</p>
          <h2 className="section-title">Nuestra Misión y Visión</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card border-l-4 border-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 rounded-xl p-3">
                <Target size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Nuestra Misión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Brindar acceso a financiamiento justo y transparente a la comunidad latina en Estados Unidos.
              Creemos que cada persona merece una oportunidad sin importar su historial crediticio, eliminando
              barreras del idioma y la burocracia. Somos el puente entre tus sueños y tu realidad financiera.
            </p>
          </div>

          <div className="card border-l-4 border-secondary">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary/10 rounded-xl p-3">
                <Eye size={28} className="text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Nuestra Visión</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Ser la plataforma financiera de mayor confianza para los hispanos en Estados Unidos, reconocida
              por nuestra ética, transparencia y compromiso con el empoderamiento económico de nuestra comunidad.
              Queremos que cada latino pueda construir un futuro sólido en este país.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
