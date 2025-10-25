import json
import os
from datetime import datetime
from typing import List, Dict

JSON_FILE = "electrodomesticos.json"

def cargar_electrodomesticos() -> List[Dict]:
    """
    Carga todos los electrodomésticos desde el archivo JSON
    Retorna una lista vacía si el archivo no existe
    """
    if os.path.exists(JSON_FILE):
        try:
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def guardar_electrodomesticos(electrodomesticos: List[Dict]):
    """
    Guarda la lista de electrodomésticos en el archivo JSON
    """
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(electrodomesticos, f, indent=2, ensure_ascii=False)

def crear_datos_ejemplo():
    """
    Crea datos de ejemplo si el archivo JSON está vacío o no existe
    """
    electrodomesticos = cargar_electrodomesticos()
    if not electrodomesticos:
        datos_ejemplo = [
            {
                "id": 1,
                "nombre": "Refrigerador Principal",
                "marca": "LG", 
                "voltaje": 220.0,
                "corriente": 1.2,
                "potencia": 264.0,
                "energia": 2.5
            },
            {
                "id": 2,
                "nombre": "Lavadora Automática", 
                "marca": "Samsung",
                "voltaje": 220.0,
                "corriente": 10.0,
                "potencia": 2200.0,
                "energia": 1.8
            },
            {
                "id": 3,
                "nombre": "Televisor Sala",
                "marca": "Sony",
                "voltaje": 110.0,
                "corriente": 0.8,
                "potencia": 88.0,
                "energia": 0.15
            },
            {
                "id": 4,
                "nombre": "Aire Acondicionado",
                "marca": "Midea", 
                "voltaje": 220.0,
                "corriente": 6.8,
                "potencia": 1500.0,
                "energia": 3.2
            },
            {
                "id": 5,
                "nombre": "Microondas",
                "marca": "Panasonic", 
                "voltaje": 110.0,
                "corriente": 12.0,
                "potencia": 1320.0,
                "energia": 1.1
            }
        ]
        guardar_electrodomesticos(datos_ejemplo)
        print(f"✅ Datos de ejemplo creados con {len(datos_ejemplo)} electrodomésticos")


def obtener_electrodomestico_por_id(electrodomestico_id: int) -> Dict:
    """
    Busca un electrodoméstico por su ID
    Retorna None si no lo encuentra
    """
    electrodomesticos = cargar_electrodomesticos()
    for electrodomestico in electrodomesticos:
        if electrodomestico["id"] == electrodomestico_id:
            return electrodomestico
    return None

def id_existe(electrodomestico_id: int) -> bool:
    """
    Verifica si un ID ya existe en la base de datos
    """
    return obtener_electrodomestico_por_id(electrodomestico_id) is not None

def obtener_proximo_id() -> int:
    """
    Calcula el próximo ID disponible
    """
    electrodomesticos = cargar_electrodomesticos()
    if not electrodomesticos:
        return 1
    return max(electrodomestico["id"] for electrodomestico in electrodomesticos) + 1