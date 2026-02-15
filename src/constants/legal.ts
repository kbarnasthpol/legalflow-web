// Estos índices deben coincidir EXACTAMENTE con el orden del iota en Go
export const ESTADOS_CASO = ["En Apertura", "En Litigio", "Para Sentencia", "Finalizado", "En Espera"];
export const RAMAS_DERECHO = ["Civil", "Penal", "Laboral", "Familia", "Comercial"];
export const SUBRAMAS: Record<string, string[]> = {
  "Civil": ["Sucesión", "Desalojo", "Daños y Perjuicios", "Contratos"],
  "Penal": ["Defensa Técnica", "Excarcelación", "Querella"],
  "Laboral": ["Despido", "Accidente de Trabajo", "Reclamo Salarial"],
  "Familia": ["Divorcio", "Cuota Alimentaria", "Régimen de Visitas"],
  "Comercial": ["Concurso", "Quiebra", "Sociedades"]
};