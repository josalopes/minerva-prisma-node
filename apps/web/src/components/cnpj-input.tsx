// ---- CnpjInput.tsx ----

import { useState } from "react";
import { maskCNPJ, validarCNPJ } from "../utils/cnpj-utils";

export default function CnpjInput() {
  const [cnpj, setCnpj] = useState("");
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCNPJ(e.target.value);
    setCnpj(masked);
    setErro("");
  };

  const handleBlur = () => {
    if (cnpj && !validarCNPJ(cnpj)) {
      setErro("CNPJ inválido");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 220 }}>
      <label>CNPJ:</label>

      <input
        type="text"
        value={cnpj}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={18}
        placeholder="00.000.000/0000-00"
      />

      {erro && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {erro}
        </span>
      )}
    </div>
  );
}
