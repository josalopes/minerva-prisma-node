export function CompanyPreview({ data, onApply }: any) {
    if (!data) return null

    return (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-2">
        <div className="font-medium">
            {data.nome_fantasia || data.razao_social}
        </div>

        <div className="text-sm text-muted-foreground">
            {data.cnae_fiscal_descricao}
        </div>

        <div className="text-sm">
            {data.logradouro}, {data.numero} - {data.bairro}
        </div>

        <div className="text-sm">
            {data.municipio}/{data.uf}
        </div>

        <button
            onClick={() => onApply(data)}
            className="text-sm text-primary font-medium"
        >
            Usar dados da empresa
        </button>
        </div>
    )
}