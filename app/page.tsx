import { CardGenerator } from "@/components/card-generator"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Magic Cards Generator</h1>
      <CardGenerator />
    </main>
  )
}
