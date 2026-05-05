import { CheckCircle2, DollarSign, MapPin, CreditCard, Building2 } from 'lucide-react'

const reqs = [
  { icon: DollarSign, text: 'Ingresos mínimos comprobables de $2,000+ al mes' },
  { icon: MapPin, text: 'Vivir dentro de los Estados Unidos' },
  { icon: CreditCard, text: 'Documento de identificación válido (ID del estado o licencia)' },
  { icon: Building2, text: 'Cuenta bancaria activa en USA' },
]

export default function Requirements() {
  return (
    <section id="requisitos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="text-secondary font-semibold uppercase tracking-wider text-sm mb-2">Sin complicaciones</p>
            <h2 className="section-title mb-4">Requisitos</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Somos prestamistas directos que entienden la realidad de la comunidad latina.
              Nuestros requisitos son simples y transparentes.
            </p>

            <div className="space-y-4">
              {reqs.map((req, i) => {
                const Icon = req.icon
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="bg-green-100 rounded-xl p-2 flex-shrink-0">
                      <CheckCircle2 size={20} className="text-green-600" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-secondary flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{req.text}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <a href="#formulario" className="btn-cta inline-block mt-8">
              Verificar si califico
            </a>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">¿Por qué elegirnos?</h3>
            <div className="space-y-5">
              {[
                { title: 'Sin intermediarios', desc: 'Somos prestamistas directos. Trato de primera mano.' },
                { title: 'Transparencia total', desc: 'Sin letras pequeñas. Conoces tus condiciones desde el inicio.' },
                { title: 'Atención en español', desc: 'Todo el proceso, de principio a fin, en tu idioma.' },
                { title: 'Aprobación rápida', desc: 'Respuesta en 24 horas o menos en la mayoría de los casos.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-black text-sm">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-blue-200 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
