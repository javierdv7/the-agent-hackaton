import random
import time
from typing import Dict
import time
from typing import Dict
from models import Electrodomestico

class SimuladorElectrodomesticos:
    def __init__(self):
        self.electrodomesticos_base = [
            {
                "id": 1,
                "nombre": "Refrigerador Principal",
                "marca": "LG",
                "voltaje_base": 220.0,
                "corriente_base": 1.2,
                "potencia_base": 264.0,
                "energia_base": 2.5
            },
            {
                "id": 2,
                "nombre": "Lavadora Automática",
                "marca": "Samsung", 
                "voltaje_base": 220.0,
                "corriente_base": 10.0,
                "potencia_base": 2200.0,
                "energia_base": 1.8
            },
            {
                "id": 3,
                "nombre": "Televisor Sala",
                "marca": "Sony",
                "voltaje_base": 110.0,
                "corriente_base": 0.8,
                "potencia_base": 88.0,
                "energia_base": 0.15
            },
            {
                "id": 4,
                "nombre": "Aire Acondicionado",
                "marca": "Midea",
                "voltaje_base": 220.0,
                "corriente_base": 6.8,
                "potencia_base": 1500.0,
                "energia_base": 3.2
            },
            {
                "id": 5, 
                "nombre": "Microondas",
                "marca": "Panasonic",
                "voltaje_base": 110.0,
                "corriente_base": 12.0,
                "potencia_base": 1320.0,
                "energia_base": 1.1
            }
        ]
    
    def generar_medicion_real(self, electrodomestico_base: Dict) -> Dict:
        """Genera mediciones realistas con variaciones aleatorias"""
        
        variacion_voltaje = random.uniform(-0.05, 0.05)  
        variacion_corriente = random.uniform(-0.15, 0.15)  
        variacion_energia = random.uniform(-0.1, 0.1)  
        
        voltaje_real = electrodomestico_base["voltaje_base"] * (1 + variacion_voltaje)
        corriente_real = electrodomestico_base["corriente_base"] * (1 + variacion_corriente)
        potencia_real = voltaje_real * corriente_real  
        energia_real = electrodomestico_base["energia_base"] * (1 + variacion_energia)
        
        return {
            "id": electrodomestico_base["id"],
            "nombre": electrodomestico_base["nombre"],
            "marca": electrodomestico_base["marca"],
            "voltaje": round(voltaje_real, 2),
            "corriente": round(corriente_real, 2),
            "potencia": round(potencia_real, 2),
            "energia": round(energia_real, 2),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def simular_todos(self) -> Dict:
        """Simula mediciones para todos los electrodomésticos"""
        mediciones = {}
        
        for electrodomestico in self.electrodomesticos_base:
            medicion = self.generar_medicion_real(electrodomestico)
            mediciones[electrodomestico["id"]] = medicion
        
        return mediciones
    
    def simular_uno(self, electrodomestico_id: int) -> Dict:
        """Simula medición para un electrodoméstico específico"""
        for electrodomestico in self.electrodomesticos_base:
            if electrodomestico["id"] == electrodomestico_id:
                return self.generar_medicion_real(electrodomestico)
        return {"error": "Electrodoméstico no encontrado"}

def simular_medicion() -> Dict:
    """Función simple que devuelve una medición simulada"""
    simulador = SimuladorElectrodomesticos()
    return simulador.simular_todos()

if __name__ == "__main__":
    simulador = SimuladorElectrodomesticos()
    
    print("=== SIMULADOR DE ELECTRODOMÉSTICOS ===")
    print("Mediciones en tiempo real:\n")
 
    for i in range(3):
        print(f"--- Medición {i+1} ---")
        mediciones = simulador.simular_todos()
        
        for electro_id, datos in mediciones.items():
            print(f"{datos['nombre']}:")
            print(f"  ⚡ Voltaje: {datos['voltaje']}V")
            print(f"  🔌 Corriente: {datos['corriente']}A") 
            print(f"  💡 Potencia: {datos['potencia']}W")
            print(f"  🔋 Energía: {datos['energia']}kWh")
            print(f"  🕐 {datos['timestamp']}\n")
        
        time.sleep(2)  