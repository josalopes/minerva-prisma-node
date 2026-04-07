"use client"

export default function TestScrollPage() {
  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}
      <div className="h-16 shrink-0 bg-blue-500 text-white flex items-center px-4">
        Header (não deve mover)
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 flex">

        {/* SIDEBAR */}
        <div className="w-40 bg-gray-200 shrink-0 p-2">
          Stepper
        </div>

        {/* FORM AREA */}
        <div className="flex-1 min-h-0 flex flex-col">

          {/* SCROLL AREA */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 border" data-scroll-container>

            {/* CONTEÚDO LONGO */}
            <div>
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="p-2 border-b">
                  Linha {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="h-60 shrink-0 border-t bg-white px-4 flex items-center">
              Footer (fixo)
          </div>

        </div>

      </div>
    </div>
  )
}