export class WakeupService {
  private ready = false
  private pending: Promise<boolean> | null = null

  constructor(private readonly apiUrl: string) {}

  async ping() {
    try {
      const res = await fetch(`${this.apiUrl}/health`, {
        cache: 'no-store',
      })

      console.log(`[Wakeup] Health: ${res.status}`)

      return {
        ok: res.ok,
        status: res.status,
      }
    } catch (error) {
      console.error('[Wakeup] Erro ao acessar /health:', error)

      return {
        ok: false,
        status: 0,
      }
    }
  }

  async waitUntilReady({ timeout = 30000, interval = 2000 } = {}) {
    const started = performance.now()

    console.log('[Wakeup] Iniciando wakeup...')

    if (this.ready) {
      const elapsed = performance.now() - started

      console.log(`[Wakeup] API disponível em ${elapsed.toFixed(0)} ms`)

      return true
    }

    if (this.pending) {
      //
      console.log('[Wakeup] Aguardando wakeup já em andamento...')
      //
      return this.pending
    }

    console.log('[Wakeup] Iniciando wakeup...')

    this.pending = this.wait(timeout, interval)

    const result = await this.pending

    this.pending = null

    return result
  }

  // private async wait(timeout: number, interval: number) {
  //   const started = Date.now()

  //   while (Date.now() - started < timeout) {
  //     const result = await this.ping()

  //     if (result.ok) {
  //       //
  //       console.log('[Wakeup] API disponível.')
  //       //
  //       this.ready = true
  //       return true
  //     }

  //     //
  //     console.log('[Wakeup] API ainda indisponível. Tentando novamente...')
  //     //

  //     await new Promise((resolve) => setTimeout(resolve, interval))
  //   }

  //   //
  //   console.log('[Wakeup] Timeout.')
  //   //

  //   return false
  // }

  private async wait(timeout: number, interval: number) {
    const started = performance.now()
    let attempts = 0

    while (performance.now() - started < timeout) {
      attempts++

      const result = await this.ping()

      if (result.ok) {
        const elapsed = performance.now() - started

        console.log(
          `[Wakeup] API disponível em ${(elapsed / 1000).toFixed(2)}s (${attempts} tentativa(s)).`,
        )

        this.ready = true
        return true
      }

      await new Promise((resolve) => setTimeout(resolve, interval))
    }

    console.log('[Wakeup] Timeout.')

    return false
  }

  reset() {
    this.ready = false
  }
}
