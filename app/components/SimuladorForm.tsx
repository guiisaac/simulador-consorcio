"use client";
import { useState, useEffect, useCallback } from "react";

interface SimuladorFormProps {
  onSubmit: (resultados: {
    parcelaBase: number;
    parcelaReduzidaInicial: number;
    parcelaAposContemplacao: number;
    totalPago: number;
    creditoDisponivel: number;
    valorFinal: number;
    meses: number;
    mesContemplacao: number;
    valorCarta: number;
    valorCartaCorrigido: number;
    valorCDI: number;
    correcaoAnual: number;
    taxaAdmin: number;
    reducao: number;
  }) => void;
}

const SimuladorForm = ({ onSubmit }: SimuladorFormProps) => {
  const [formData, setFormData] = useState({
    valorCarta: 100000,
    reducao: 15,
    meses: 200,
    mesContemplacao: 13,
    taxaAdmin: 20,
    correcaoAnual: 5,
    valorCDI: 10,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: number): string => {
    switch (name) {
      case 'valorCarta':
        if (value <= 0) return 'Valor deve ser maior que 0';
        if (value > 10000000) return 'Valor máximo é 10 milhões';
        break;
      case 'reducao':
        if (value < 0) return 'Redução não pode ser negativa';
        if (value > 90) return 'Redução máxima é 90%';
        break;
      case 'meses':
        if (value < 12) return 'Prazo mínimo é 12 meses';
        if (value > 400) return 'Prazo máximo é 400 meses';
        break;
      case 'mesContemplacao':
        if (value < 1) return 'Mês deve ser maior que 0';
        if (value > formData.meses) return 'Não pode ser maior que o prazo';
        break;
      case 'taxaAdmin':
        if (value < 0) return 'Taxa não pode ser negativa';
        if (value > 50) return 'Taxa máxima é 50%';
        break;
      case 'correcaoAnual':
        if (value < 0) return 'Correção não pode ser negativa';
        if (value > 50) return 'Correção máxima é 50%';
        break;
      case 'valorCDI':
        if (value < 0) return 'CDI não pode ser negativo';
        if (value > 50) return 'CDI máximo é 50%';
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value);
    
    // Validação de segurança para números
    if (isNaN(numValue) || !isFinite(numValue)) return;
    
    const error = validateField(name, numValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      const defaultValue = 0;
      const error = validateField(name, defaultValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
      setFormData(prev => ({
        ...prev,
        [name]: defaultValue
      }));
    }
  };

  const calcularSimulacao = useCallback(() => {
    // Verifica se há erros antes de calcular
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }

    // Proteção contra divisão por zero
    if (formData.meses === 0) return;

    const parcelaBase = (formData.valorCarta * (1 + formData.taxaAdmin/100)) / formData.meses;
    const parcelaReduzidaInicial = parcelaBase * (1 - formData.reducao/100);
    const parcelaAposContemplacao = parcelaBase;

    let totalPago = 0;
    for (let mes = 1; mes <= formData.meses; mes++) {
      const correcaoAteAgora = Math.pow(1 + formData.correcaoAnual/100, Math.floor((mes-1)/12));
      if (mes <= formData.mesContemplacao) {
        totalPago += parcelaReduzidaInicial * correcaoAteAgora;
      } else {
        totalPago += parcelaAposContemplacao * correcaoAteAgora;
      }
    }

    const correcaoAteContemplacao = Math.pow(1 + formData.correcaoAnual/100, Math.floor((formData.mesContemplacao-1)/12));
    const valorCartaCorrigido = formData.valorCarta * correcaoAteContemplacao;

    const taxaCDIMensal = Math.pow(1 + formData.valorCDI/100, 1/12) - 1;
    const mesesAposContemplacao = formData.meses - formData.mesContemplacao;
    const valorFinal = valorCartaCorrigido * Math.pow(1 + taxaCDIMensal, mesesAposContemplacao);

    onSubmit({
      parcelaBase,
      parcelaReduzidaInicial,
      parcelaAposContemplacao,
      totalPago,
      creditoDisponivel: formData.valorCarta,
      valorFinal,
      meses: formData.meses,
      mesContemplacao: formData.mesContemplacao,
      valorCarta: formData.valorCarta,
      valorCartaCorrigido,
      valorCDI: formData.valorCDI,
      correcaoAnual: formData.correcaoAnual,
      taxaAdmin: formData.taxaAdmin,
      reducao: formData.reducao,
    });
  }, [formData, onSubmit, errors]);

  useEffect(() => {
    calcularSimulacao();
  }, [calcularSimulacao]);

  const campos = [
    { label: 'Valor da carta', name: 'valorCarta', unidade: 'R$', min: 1000, max: 10000000 },
    { label: '% de redução', name: 'reducao', unidade: '%', min: 0, max: 90 },
    { label: 'Prazo', name: 'meses', unidade: 'meses', min: 12, max: 400 },
    { label: 'Mês contemplação', name: 'mesContemplacao', unidade: 'mês', min: 1 },
    { label: 'Taxa administrativa', name: 'taxaAdmin', unidade: '%', min: 0, max: 50 },
    { label: 'Correção anual', name: 'correcaoAnual', unidade: '% a.a.', min: 0, max: 50 },
    { label: 'Valor do CDI', name: 'valorCDI', unidade: '% a.a.', min: 0, max: 50 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-7 gap-3">
        {campos.map((campo) => (
          <div key={campo.name}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {campo.label} <span className="text-gray-500">({campo.unidade})</span>
            </label>
            <input
              type="number"
              name={campo.name}
              value={formData[campo.name as keyof typeof formData]}
              onChange={handleChange}
              onBlur={handleBlur}
              min={campo.min}
              max={campo.max}
              step="any"
              className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                errors[campo.name] ? 'border-red-500' : 'border-gray-300'
              }`}
              inputMode="numeric"
              autoComplete="off"
            />
            {errors[campo.name] && (
              <p className="text-xs text-red-500 mt-1">{errors[campo.name]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimuladorForm; 