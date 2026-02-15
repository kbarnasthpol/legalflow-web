'use client'
import { useEffect, useState, useMemo, useRef, Suspense } from 'react'
import api from '@/lib/axios'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { ESTADOS_CASO, RAMAS_DERECHO, SUBRAMAS } from '@/constants/legal'
import { Briefcase, User, Scale, Activity, ArrowLeft, Layers, ChevronDown, X, DollarSign, Coins } from 'lucide-react'

function FormularioNuevoCaso() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clienteIdUrl = searchParams.get('clienteId')

  const [clientes, setClientes] = useState<{ id: string, nombre: string, apellido: string }[]>([])
  const [subramaSeleccionada, setSubramaSeleccionada] = useState("")
  const [cargando, setCargando] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [montoVisual, setMontoVisual] = useState("")
  const [moneda, setMoneda] = useState<'ARS' | 'UBAS'>('ARS')
  const containerRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    cliente_id: clienteIdUrl || '',
    tipo: 0, 
    estado: 0,
    honorarios_totales: 0,
    moneda: 'ARS',
    link_carpeta: ''
  })

  // ÚNICA FUNCIÓN DE MONEDA (Corregida)
  const handleMontoChange = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, "")
    const numero = parseInt(soloNumeros) || 0
    
    if (moneda === 'ARS') {
      setMontoVisual(numero.toLocaleString('es-AR'))
    } else {
      setMontoVisual(soloNumeros) 
    }
    
    setFormData(prev => ({ ...prev, honorarios_totales: numero, moneda: moneda }))
  }

  const toggleMoneda = (tipo: 'ARS' | 'UBAS') => {
    setMoneda(tipo)
    setMontoVisual("")
    setFormData(prev => ({ ...prev, honorarios_totales: 0, moneda: tipo }))
  }

  // Cargar Clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await api.get('/clientes')
        const ordenados = res.data.sort((a: any, b: any) => a.apellido.localeCompare(b.apellido))
        setClientes(ordenados)
        
        if (clienteIdUrl) {
          const cliente = ordenados.find((c: any) => c.id === clienteIdUrl)
          if (cliente) {
            setBusqueda(`${cliente.apellido}, ${cliente.nombre}`)
            setFormData(prev => ({ ...prev, cliente_id: cliente.id }))
          }
        }
      } catch (error) { console.error(error) }
    }
    cargarClientes()
  }, [clienteIdUrl])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(c => 
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
    )
  }, [clientes, busqueda])

  useEffect(() => {
    const cliente = clientes.find(c => c.id === formData.cliente_id)
    const ramaNombre = RAMAS_DERECHO[formData.tipo]
    if (cliente && subramaSeleccionada) {
      const nuevoTitulo = `${subramaSeleccionada} - ${cliente.apellido}, ${cliente.nombre} - ${ramaNombre}`
      setFormData(prev => ({ ...prev, titulo: nuevoTitulo.toUpperCase() }))
    }
  }, [formData.cliente_id, formData.tipo, subramaSeleccionada, clientes])

  const limpiarBusqueda = () => {
    setBusqueda("")
    setFormData(prev => ({ ...prev, cliente_id: "" }))
    setMenuAbierto(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.cliente_id) return alert("Por favor, selecciona un cliente")
    setCargando(true)
    try {
      await api.post('/casos', formData)
      router.push('/dashboard/casos')
    } catch (error) { alert("Error al crear expediente") } 
    finally { setCargando(false) }
  }

  return (
    <div className="max-w-3xl bg-white/90 backdrop-blur-md rounded-[40px] p-10 shadow-2xl border border-white/20 mx-auto font-lexend">
      <h1 className="text-3xl font-black text-azul uppercase mb-10 text-center tracking-tighter italic">Apertura de Expediente</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BUSCADOR CON BOTÓN LIMPIAR Y FLECHA DESPLEGABLE */}
        <div className="space-y-2 relative" ref={containerRef}>
          <label className="text-xs font-black text-azul/40 uppercase ml-2 flex items-center gap-2">
            <User size={14} /> Cliente Titular
          </label>
          <div className="relative group">
            <input 
              type="text"
              placeholder="Buscar cliente por apellido..."
              className="w-full px-6 py-4 bg-beige/30 border-2 border-azul/5 rounded-2xl focus:border-dorado outline-none text-azul font-bold transition-all pr-20"
              value={busqueda}
              onFocus={() => setMenuAbierto(true)}
              onChange={(e) => {
                setBusqueda(e.target.value)
                setMenuAbierto(true)
                if (formData.cliente_id) setFormData(prev => ({...prev, cliente_id: ""}))
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {busqueda && (
                <button 
                  type="button" 
                  onClick={limpiarBusqueda}
                  className="p-1.5 hover:bg-coral/20 text-coral rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              {/* Botón de Flecha para desplegar todo */}
              <button 
                type="button"
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="p-1.5 hover:bg-azul/10 text-azul/40 rounded-full transition-all"
              >
                <ChevronDown className={`transition-transform duration-300 ${menuAbierto ? 'rotate-180' : ''}`} size={20} />
              </button>
            </div>
          </div>

          {menuAbierto && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-azul/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map(c => (
                  <div 
                    key={c.id}
                    className="px-6 py-4 hover:bg-dorado hover:text-azul cursor-pointer font-bold text-azul transition-colors border-b border-azul/5 last:border-none"
                    onClick={() => {
                      setFormData(prev => ({...prev, cliente_id: c.id}))
                      setBusqueda(`${c.apellido}, ${c.nombre}`)
                      setMenuAbierto(false)
                    }}
                  >
                    {c.apellido}, {c.nombre}
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-azul/40 italic">No se encontraron resultados</div>
              )}
            </div>
          )}
        </div>

        {/* ... Resto de los campos (Rama, Subrama, Carátula, etc.) ... */}
        {/* Asegúrate de usar la lógica de Moneda que unificamos arriba */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-azul/40 uppercase ml-2 flex items-center gap-2">
              <Scale size={14} /> Rama Principal
            </label>
            <select 
              className="w-full px-6 py-4 bg-beige/30 border-2 border-azul/5 rounded-2xl focus:border-dorado outline-none text-azul font-bold"
              value={formData.tipo}
              onChange={(e) => {
                setFormData(prev => ({...prev, tipo: parseInt(e.target.value)}))
                setSubramaSeleccionada("") 
              }}
            >
              {RAMAS_DERECHO.map((rama, index) => (
                <option key={rama} value={index}>{rama}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-azul/40 uppercase ml-2 flex items-center gap-2">
              <Layers size={14} /> Objeto del Juicio
            </label>
            <select 
              required
              className="w-full px-6 py-4 bg-beige/30 border-2 border-azul/5 rounded-2xl focus:border-dorado outline-none text-azul font-bold"
              value={subramaSeleccionada}
              onChange={(e) => setSubramaSeleccionada(e.target.value)}
            >
              <option value="">Seleccione sub-rama...</option>
              {SUBRAMAS[RAMAS_DERECHO[formData.tipo]]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-azul/40 uppercase ml-2 flex items-center gap-2">
            <Briefcase size={14} /> Carátula Generada (Editable)
          </label>
          <input 
            type="text"
            required
            value={formData.titulo}
            className="w-full px-6 py-5 bg-azul text-beige border-2 border-dorado rounded-2xl outline-none font-black text-lg shadow-xl uppercase italic"
            onChange={(e) => setFormData(prev => ({...prev, titulo: e.target.value}))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-azul/40 uppercase ml-2 flex items-center gap-2">
              <Activity size={14} /> Estado Inicial
            </label>
            <select 
              className="w-full px-6 py-4 bg-beige/30 border-2 border-azul/5 rounded-2xl focus:border-dorado outline-none text-azul font-bold"
              onChange={(e) => setFormData(prev => ({...prev, estado: parseInt(e.target.value)}))}
            >
              {ESTADOS_CASO.map((estado, index) => (
                <option key={estado} value={index}>{estado}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-2">
              <label className="text-xs font-black text-azul/40 uppercase flex items-center gap-2">
                <Coins size={14} /> Honorarios
              </label>
              <div className="flex bg-azul/5 p-1 rounded-lg border border-azul/10">
                <button 
                  type="button"
                  onClick={() => toggleMoneda('ARS')}
                  className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${moneda === 'ARS' ? 'bg-azul text-beige shadow-sm' : 'text-azul/40'}`}
                >
                  ARS $
                </button>
                <button 
                  type="button"
                  onClick={() => toggleMoneda('UBAS')}
                  className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${moneda === 'UBAS' ? 'bg-dorado text-azul shadow-sm' : 'text-azul/40'}`}
                >
                  UBAS
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-azul font-black opacity-40">
                {moneda === 'ARS' ? '$' : '⧫'} 
              </span>
              <input 
                type="text"
                placeholder={moneda === 'ARS' ? "0.00" : "Cant. UBAS"}
                className="w-full pl-12 pr-6 py-4 bg-beige/30 border-2 border-azul/5 rounded-2xl focus:border-dorado outline-none text-azul font-bold"
                value={montoVisual}
                onChange={(e) => handleMontoChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button 
          disabled={cargando || !formData.cliente_id}
          className="w-full py-6 bg-esmeralda text-azul text-xl font-black uppercase tracking-widest rounded-3xl hover:bg-dorado transition-all shadow-2xl mt-4 disabled:opacity-30"
        >
          {cargando ? 'REGISTRANDO...' : 'ABRIR EXPEDIENTE'}
        </Button>
      </form>
    </div>
  )
}

export default function NuevoCasoPage() {
  const router = useRouter()
  return (
    <div className="p-8 bg-legal min-h-screen">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-azul/60 hover:text-azul mb-6 font-bold uppercase text-xs">
        <ArrowLeft size={16} /> Volver
      </button>
      <Suspense fallback={<div className="text-center p-20 text-azul font-black animate-pulse uppercase">Cargando...</div>}>
        <FormularioNuevoCaso />
      </Suspense>
    </div>
  )
}