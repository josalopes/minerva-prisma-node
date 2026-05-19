"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Receipt } from "./receipt"
import html2pdf from "html2pdf.js"

export function PrintReceipt({ transaction }) {
  const ref = useRef<HTMLDivElement>(null)

  

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: "cupom"
  })

  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={ref}>
          <Receipt transaction={transaction} />
        </div>
      </div>

      <button onClick={handlePrint}>
        Imprimir cupom
      </button>
    </>
  )
}

// export function generateReceiptPDF() {
//   const element = document.getElementById("receipt")

//   if (!element) return

//   html2pdf()
//     .set({
//       margin: 5,
//       filename: "cupom.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: {
//         unit: "mm",
//         format: [80, 200] // tamanho tipo cupom
//       }
//     })
//     .from(element)
//     .save()
// }