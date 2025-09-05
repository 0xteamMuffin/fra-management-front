import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  {
    title: "Digitize FRA Claims",
    desc: "Leverage AI to extract and digitize legacy records of Forest Rights, creating a centralized digital archive.",
  },
  {
    title: "Interactive FRA Atlas",
    desc: "Explore granted FRA areas through a dynamic WebGIS portal with spatial and socio-economic data.",
  },
  {
    title: "AI-Powered Asset Maps",
    desc: "Use satellite imagery and computer vision to automatically map assets in FRA villages.",
  },
  {
    title: "Decision Support System",
    desc: "Recommend and layer government schemes for beneficiaries, enabling targeted development.",
  },
]

export function Features() {
  return (
    <section className="max-w-7xl mx-auto pb-16">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Platform Capabilities</h2>
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {items.map((it) => (
          <Card key={it.title} className="bg-[#111827]/60 border-sky-400/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sky-300">{it.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-200">{it.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
