import { Application } from 'Engine/Engine'
import { Sandbox } from 'Sandbox/Sandbox'

async function main() {
  const parent = document.querySelector('#app') as HTMLDivElement

  const app: Application = new Sandbox(parent)
  app.start()
}

window.onload = async () => {
  main().catch(console.error)
}
