from fastapi import FastAPI, HTTPException
from models import Electrodomestico
from database import cargar_electrodomesticos, guardar_electrodomesticos, crear_datos_ejemplo, id_existe
from datetime import datetime
from simulador import SimuladorElectrodomesticos


app = FastAPI(title="API Gestión de Electrodomésticos", version="1.0.0")

@app.on_event("startup")
def startup():
    crear_datos_ejemplo()

@app.get("/")
def read_root():
    return {
        "message": "API de Gestión de Electrodomésticos",
        "endpoints": {
            "leer_electrodomesticos": "GET /electrodomesticos",
            "agregar_electrodomestico": "POST /electrodomesticos", 
            "eliminar_electrodomestico": "DELETE /electrodomesticos/{id}"
        }
    }

@app.get("/electrodomesticos")
def leer_electrodomesticos():
    """Obtener todos los electrodomésticos"""
    electrodomesticos = cargar_electrodomesticos()
    return electrodomesticos

@app.post("/electrodomesticos")
def agregar_electrodomestico(electrodomestico: Electrodomestico):
    """Agregar un nuevo electrodoméstico"""
    electrodomesticos = cargar_electrodomesticos()

    if id_existe(electrodomestico.id):
        raise HTTPException(status_code=400, detail=f"El ID {electrodomestico.id} ya existe")

    electrodomesticos.append(electrodomestico.dict())
    guardar_electrodomesticos(electrodomesticos)
    
    return {
        "message": "Electrodoméstico agregado correctamente", 
        "electrodomestico": electrodomestico
    }

@app.delete("/electrodomesticos/{electrodomestico_id}")
def eliminar_electrodomestico(electrodomestico_id: int):
    """Eliminar un electrodoméstico por ID"""
    electrodomesticos = cargar_electrodomesticos()
    
    for i, electrodomestico in enumerate(electrodomesticos):
        if electrodomestico["id"] == electrodomestico_id:
            eliminado = electrodomesticos.pop(i)
            guardar_electrodomesticos(electrodomesticos)
            return {
                "message": "Electrodoméstico eliminado correctamente", 
                "electrodomestico_eliminado": eliminado
            }
    
    raise HTTPException(status_code=404, detail="Electrodoméstico no encontrado")

@app.get("/simulador")
def obtener_mediciones_simuladas():
    """Obtener mediciones simuladas en tiempo real"""
    simulador = SimuladorElectrodomesticos()
    return simulador.simular_todos()

@app.get("/simulador/{electrodomestico_id}")
def obtener_medicion_simulada(electrodomestico_id: int):
    """Obtener medición simulada para un electrodoméstico específico"""
    simulador = SimuladorElectrodomesticos()
    return simulador.simular_uno(electrodomestico_id)