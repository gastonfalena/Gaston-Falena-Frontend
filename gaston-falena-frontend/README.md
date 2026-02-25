# 📦 InventarList - Frontend (React + Vite)

Interfaz de usuario (SPA) para **InventarList**, una aplicación de gestión jerárquica de inventarios. Permite a los usuarios organizar sus pertenencias en Casas, Contenedores e Ítems a través de una experiencia fluida y responsive.

## 🚀 Tecnologías Utilizadas

Este proyecto fue inicializado con **Vite** para garantizar tiempos de compilación ultrarrápidos y un entorno de desarrollo óptimo.

- **Core:** React 18, TypeScript
- **Enrutamiento:** React Router DOM v6
- **Peticiones HTTP:** Axios (con interceptores configurados para el manejo de credenciales)
- **Estilos:** CSS puro modularizado por componentes.

## 🏗️ Arquitectura y Estructura

El código está organizado modularmente para separar responsabilidades y facilitar la escalabilidad:

- **`/src/api`**: Configuración centralizada de la instancia de Axios, manejando las cookies y credenciales automáticamente (`withCredentials: true`).
- **`/src/components`**: Componentes reutilizables que renderizan la lógica de negocio (Secciones de Casas, Contenedores e Ítems, Navbar, etc.).
- **`/src/layouts`**: Controladores de enrutamiento visual. Incluye un `ProtectedLayout` que restringe el acceso a usuarios no autenticados y redirige al login de manera segura.
- **`/src/pages`**: Vistas principales de la aplicación (Home, Login, Register, Dashboard).

## ⚙️ Configuración Local

### Prerrequisitos

- Node.js (v18 o superior)
- Backend de InventarList en ejecución (por defecto en `http://localhost:3000`).

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/gastonfalena/Gaston-Falena-Frontend.git](https://github.com/gastonfalena/Gaston-Falena-Frontend.git)
   cd Gaston-Falena-Frontend
   ```

###

VITE_API_URL=url_para_hacer_fetch

###
