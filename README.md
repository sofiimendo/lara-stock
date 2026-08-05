# 🧁 Lara Stock

Sistema de gestión de stock desarrollado para **Lara Pastelería**.

Permite administrar los insumos de la pastelería, controlar el stock disponible y visualizar información relevante para la gestión diaria.

---

## 👥 Integrantes

- Sofía Mendoza
- Yamila Valdez Aguilar

---

## 🚀 Tecnologías

### Backend

- Node.js
- Express
- Zod
- UUID
- Dotenv

### Herramientas

- Git
- GitHub
- Postman

---

## 📂 Arquitectura

El proyecto sigue una arquitectura por capas:

```
backend/
│
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── schemas/
│   ├── data/
│   └── server.js
```

Cada capa tiene una responsabilidad específica:

- **Routes:** define las rutas de la API.
- **Controllers:** recibe las peticiones HTTP.
- **Services:** contiene la lógica de negocio.
- **Models:** acceso a los datos.
- **Schemas:** validaciones con Zod.
- **Middlewares:** validaciones y funciones reutilizables.

---

## 📦 Funcionalidades implementadas

- CRUD completo de insumos.
- Validaciones con Zod.
- Identificadores únicos con UUID.
- Resumen de stock.
- Filtros por nombre, categoría y estado.
- Persistencia de datos en JSON.

---

## 📡 Endpoints

| Método | Endpoint | Descripción |
|---------|----------|-------------|
| GET | `/api/items` | Obtener todos los insumos |
| GET | `/api/items/resumen` | Obtener resumen del stock |
| POST | `/api/items` | Crear un insumo |
| PUT | `/api/items/:id` | Actualizar un insumo |
| DELETE | `/api/items/:id` | Eliminar un insumo |

---

## ▶️ Instalación

```bash
npm install
```

## Ejecutar

```bash
npm run dev
```

El servidor se ejecuta en:

```
http://localhost:4000
```

---

## 📌 Estado del proyecto

🚧 En desarrollo.

Próximas funcionalidades:

- Gestión de usuarios.
- Autenticación con JWT.
- Integración con el frontend.
- Dashboard completo.