// ---- CpfInput.tsx ----

import { useState } from "react";
import { maskCPF, validarCPF } from '../utils/cpf-utils';

export default function CpfInput() {
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCPF(e.target.value);
    setCpf(masked);
    setErro(""); // remove mensagem ao digitar
  };

  const handleBlur = () => {
    if (cpf && !validarCPF(cpf)) {
      setErro("CPF inválido");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 200 }}>
      <label>CPF:</label>
      <input
        type="text"
        value={cpf}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={14}
        placeholder="000.000.000-00"
      />

      {erro && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {erro}
        </span>
      )}
    </div>
  );
}
