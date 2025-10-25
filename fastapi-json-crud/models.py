from pydantic import BaseModel
from typing import Optional

class Electrodomestico(BaseModel):
    id: int
    nombre: str
    marca: str
    voltaje: float  
    corriente: float  
    potencia: float  
    energia: float
