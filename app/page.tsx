import { CardGenerator } from "@/components/card-generator"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <CardGenerator />
      </main>
    </>
  )
}
