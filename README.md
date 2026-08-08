# 🍰 Lara Stock

Sistema de gestión de stock desarrollado para **Lara Pastelería**, pensado para facilitar el control de insumos utilizados en la producción diaria.

La aplicación permite administrar el inventario, registrar entradas y salidas de productos, consultar el historial de movimientos y gestionar usuarios mediante autenticación con JWT.

---

## 📋 Descripción

**Lara Stock** nace como una solución para organizar y controlar de manera sencilla los insumos de una pastelería.

El sistema permite conocer rápidamente:

- Qué insumos están disponibles.
- Cuánto stock hay de cada producto.
- Qué productos tienen stock bajo.
- Qué productos se encuentran sin stock.
- Qué entradas y salidas se realizaron.
- Por qué motivo se modificó el stock.
- Registrar usuarios.
- Iniciar sesión de manera segura.
- Acceder a rutas protegidas mediante autenticación.

De esta manera, el inventario se mantiene actualizado a partir de los movimientos registrados en el sistema.

---

## ✨ Funcionalidades

### 📦 Gestión de insumos

La aplicación permite:

- Agregar nuevos insumos.
- Editar insumos existentes.
- Eliminar insumos.
- Consultar todos los productos.
- Buscar insumos por nombre.
- Filtrar insumos por categoría.

Cada insumo contiene información como:

- Nombre.
- Categoría.
- Cantidad disponible.
- Unidad de medida.
- Stock mínimo.
- Estado actual.

---

### 🚦 Estados de stock

El sistema determina automáticamente el estado de cada insumo:

- 🟢 **Disponible:** cantidad superior al stock mínimo.
- 🟡 **Stock bajo:** cantidad igual o inferior al stock mínimo.
- 🔴 **Sin stock:** cantidad igual a 0.

En la parte superior de la aplicación se muestra un resumen con:

- Insumos totales.
- Productos con stock bajo.
- Productos sin stock.

Las tarjetas también permiten filtrar rápidamente el inventario según el estado del stock.

---

### 📥📤 Movimientos de stock

Desde cada insumo se puede registrar un movimiento.

Los movimientos pueden ser:

- **Entrada:** aumenta la cantidad disponible.
- **Salida:** disminuye la cantidad disponible.

Cada movimiento puede incluir:

- Insumo.
- Tipo de movimiento.
- Cantidad.
- Motivo.
- Fecha.

El sistema actualiza automáticamente el stock después de registrar el movimiento.

También se realizan validaciones para evitar cantidades incorrectas y salidas superiores al stock disponible.

---

### 🕒 Historial de movimientos

La aplicación incluye un historial donde se pueden consultar las entradas y salidas realizadas.

En cada movimiento se muestra:

- Fecha.
- Insumo.
- Tipo de movimiento.
- Cantidad.
- Motivo.

Además, el historial puede filtrarse por:

- Todos los movimientos.
- Entradas.
- Salidas.

---

### 🔎 Búsqueda y filtros

Los insumos pueden buscarse por nombre y filtrarse por categoría.

Las búsquedas son **case insensitive**, por lo que no importa si el usuario utiliza mayúsculas o minúsculas.

La búsqueda se realiza dinámicamente para mejorar la experiencia de uso.

También se puede acceder rápidamente a los productos según su estado utilizando las tarjetas de resumen.

---

### 👤 Usuarios y autenticación

La API permite registrar usuarios e iniciar sesión de forma segura.

El sistema utiliza:

- Contraseñas hasheadas con `bcryptjs`.
- Tokens JWT para autenticación.
- Middleware para validar tokens.
- Rutas protegidas.

La contraseña nunca se devuelve en las respuestas de la API.

---

### 👤 Perfil de usuario

La interfaz incluye un menú de usuario correspondiente a la administradora del sistema.

Desde el menú de **Lara** se puede acceder a:

- **Mi perfil**
- **Acerca del sistema**

El perfil muestra información básica de la administradora y del negocio.

---

### 🔔 Notificaciones

La aplicación utiliza notificaciones visuales para informar al usuario cuando una operación se realiza correctamente o cuando ocurre un error.

Por ejemplo:

- Insumo agregado correctamente.
- Insumo actualizado correctamente.
- Insumo eliminado correctamente.
- Entrada registrada correctamente.
- Salida registrada correctamente.
- Errores de validación.
- Errores de autenticación.
- Errores de conexión.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express

### Seguridad y validaciones

- bcryptjs
- JSON Web Token
- Zod
- dotenv

### Otras herramientas

- CORS
- UUID
- Nodemon
- Postman
- Git
- GitHub

---

## 🔄 Comunicación entre Frontend y Backend

El frontend se comunica con el backend mediante una **API REST**, utilizando `fetch`.

Los datos son enviados y recibidos en formato **JSON**.

---

## 📚 Documentación de la API

La documentación completa de los endpoints se encuentra en la sección:

[Ver documentación de la API REST](#-api-rest)

---

## 🔗 API REST

La API de Lara Stock permite administrar usuarios, insumos y movimientos del inventario.

La URL local base es:

```text
http://localhost:4000/api
```

---

## 👤 Usuarios

### Registrar usuario

```http
POST /api/users/register
```

Registra un nuevo usuario.

La contraseña se almacena hasheada utilizando `bcryptjs`.

Ejemplo de body:

```json
{
  "nombre": "Lara",
  "email": "lara@pasteleria.com",
  "password": "lara123"
}
```

Ejemplo de respuesta:

```json
{
  "mensaje": "Usuario registrado correctamente",
  "usuario": {
    "id": "id-del-usuario",
    "nombre": "Lara",
    "email": "lara@pasteleria.com",
    "createdAt": "fecha-de-creacion"
  }
}
```

La contraseña no se incluye en la respuesta.

---

### Iniciar sesión

```http
POST /api/users/login
```

Valida las credenciales del usuario y devuelve un token JWT.

Ejemplo de body:

```json
{
  "email": "lara@pasteleria.com",
  "password": "lara123"
}
```

Ejemplo de respuesta:

```json
{
  "mensaje": "Inicio de sesión correcto",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": "id-del-usuario",
    "nombre": "Lara",
    "email": "lara@pasteleria.com"
  }
}
```

---

### Obtener perfil protegido

```http
GET /api/users/profile
```

Esta ruta requiere autenticación.

El token JWT debe enviarse mediante el header:

```text
Authorization: Bearer TOKEN
```

Sin token, la API responde:

```text
401 Unauthorized
```

Ejemplo:

```json
{
  "mensaje": "Token de autenticación requerido"
}
```

Con un token válido, devuelve los datos del usuario autenticado.

---

## 📦 Insumos

### Obtener insumos

```http
GET /api/items
```

Obtiene la lista de insumos registrados.

También permite realizar búsquedas y aplicar filtros.

---

### Crear un insumo

```http
POST /api/items
```

Permite registrar un nuevo insumo.

---

### Actualizar un insumo

```http
PUT /api/items/:id
```

Permite modificar los datos de un insumo existente.

---

### Eliminar un insumo

```http
DELETE /api/items/:id
```

Permite eliminar un insumo.

---

## 📊 Resumen de stock

```http
GET /api/items/resumen
```

Devuelve información general del inventario:

- Total de insumos.
- Insumos con stock bajo.
- Insumos sin stock.

---

## 📥📤 Movimientos

### Obtener movimientos

```http
GET /api/movements
```

Obtiene el historial de entradas y salidas del inventario.

---

### Registrar un movimiento

```http
POST /api/movements
```

Permite registrar una nueva entrada o salida de stock.

Al registrar un movimiento, la cantidad disponible del insumo se actualiza automáticamente.

El sistema evita registrar una salida superior al stock disponible.

---

## 🔐 Seguridad

La API implementa distintas medidas de seguridad y validación.

### Contraseñas

Las contraseñas son almacenadas utilizando `bcryptjs`.

Esto evita guardar contraseñas en texto plano.

---

### JSON Web Token

Después de iniciar sesión correctamente, la API genera un token JWT.

Este token permite acceder a rutas protegidas.

---

### Middleware de autenticación

El middleware de autenticación verifica que el token:

- Exista.
- Utilice el formato `Bearer`.
- Sea válido.
- No esté vencido.

Si el token no es válido, la API responde con:

```text
401 Unauthorized
```

---

### Validación de datos

Se utiliza **Zod** para validar los datos recibidos por la API.

Esto permite detectar solicitudes malformadas antes de ejecutar la lógica principal.

---

### Variables de entorno

Las configuraciones sensibles se administran mediante un archivo:

```text
.env
```

El archivo `.env` se encuentra ignorado por Git y **no debe subirse al repositorio**.

Para facilitar la configuración del proyecto se incluye:

```text
example.env
```

---

## 📂 Estructura general del proyecto

```text
lara-stock/
│
├── backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── items.controller.js
│   │   │   ├── movements.controller.js
│   │   │   └── users.controller.js
│   │   │
│   │   ├── data/
│   │   │   ├── items.json
│   │   │   ├── movements.json
│   │   │   └── users.json
│   │   │
│   │   ├── middlewares/
│   │   │   ├── validate.middleware.js
│   │   │   └── auth.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── items.model.js
│   │   │   ├── movements.model.js
│   │   │   └── users.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── items.routes.js
│   │   │   ├── movements.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── schemas/
│   │   │   └── users.schema.js
│   │   │
│   │   ├── services/
│   │   │   ├── items.service.js
│   │   │   ├── movements.service.js
│   │   │   └── users.service.js
│   │   │
│   │   └── server.js
│   │
│   ├── example.env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── assets/
│   │   └── images/
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   ├── js/
│   │   └── app.js
│   │
│   └── index.html
│
├── .gitignore
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clonar el repositorio

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/sofiimendo/lara-stock
```

Luego ingresar a la carpeta del proyecto:

```bash
cd lara-stock
```

---

### 2. Instalar las dependencias del backend

Ingresar a:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

---

### 3. Configurar variables de entorno

Crear un archivo `.env` dentro de `backend`.

Puede utilizarse `example.env` como referencia.

La configuración debe incluir el puerto y una clave para los tokens JWT.

Ejemplo:

```env
PORT=4000
JWT_SECRET=una_clave_secreta
```

El archivo `.env` no debe subirse a GitHub.

---

### 4. Iniciar el servidor

Ejecutar:

```bash
npm run dev
```

El backend estará disponible localmente en:

```text
http://localhost:4000
```

---

### 5. Ejecutar el frontend

Abrir:

```text
frontend/index.html
```

También puede utilizarse la extensión **Live Server** de Visual Studio Code.

El frontend se conecta localmente con la API ejecutándose en el puerto `4000`.

---

## 🧪 Pruebas

Las rutas de la API fueron probadas utilizando **Postman**.

Se verificó el funcionamiento de:

- Registro de usuarios.
- Hash de contraseñas.
- Inicio de sesión.
- Generación de JWT.
- Acceso sin token.
- Acceso con token válido.
- Obtención de insumos.
- Creación de insumos.
- Modificación de insumos.
- Eliminación de insumos.
- Entradas de stock.
- Salidas de stock.
- Prevención de salidas superiores al stock disponible.
- Historial de movimientos.
- Filtros.

---

## ✅ Validaciones

El sistema incluye distintas validaciones para mantener la consistencia del inventario y la seguridad de la API.

Entre ellas:

- Campos obligatorios.
- Validación de email.
- Contraseña mínima para registro.
- Contraseñas hasheadas.
- Validación de tokens JWT.
- Cantidades mayores a 0 para movimientos.
- Cantidades enteras cuando la unidad seleccionada es `unidades`.
- Cantidades decimales para unidades de medida que lo permiten.
- Control del stock disponible.
- Prevención de salidas superiores al stock existente.
- Confirmación antes de eliminar un insumo.
- Consultas case insensitive.
- Manejo de errores provenientes de la API.

---

## 🎨 Interfaz y experiencia de usuario

La interfaz fue diseñada buscando una experiencia:

- Simple.
- Clara.
- Intuitiva.
- Responsive.
- Visualmente relacionada con la identidad de Lara Pastelería.

La aplicación incluye:

- Menú lateral de navegación.
- Tarjetas de resumen.
- Buscador.
- Filtros.
- Estados visuales de stock.
- Ventanas modales.
- Notificaciones.
- Menú de usuario.
- Historial de movimientos.

Se utilizaron tonos verdes y pastel para mantener una estética relacionada con la identidad visual del emprendimiento.

---

## 💡 Funcionamiento del stock

Una de las funcionalidades principales de Lara Stock es que el inventario no necesita modificarse manualmente cada vez que se utiliza un producto.

Por ejemplo, si existen:

```text
5 kg de manteca
```

y se registra una salida de:

```text
2 kg
```

el sistema actualiza automáticamente el stock a:

```text
3 kg de manteca
```

De la misma manera, cuando se registra una compra o reposición mediante una **entrada**, el stock aumenta automáticamente.

Esto permite mantener un registro de qué ocurrió con cada insumo y consultar posteriormente el movimiento en el historial.

---

## 🎯 Objetivo del proyecto

El objetivo principal del proyecto fue desarrollar una aplicación completa integrando conceptos de **Frontend y Backend**.

Durante el desarrollo se trabajó con:

- Arquitectura modular.
- Rutas.
- Controladores.
- Modelos.
- Servicios.
- Middlewares.
- Manipulación del DOM.
- Eventos en JavaScript.
- Formularios.
- Validaciones.
- Métodos HTTP.
- API REST.
- Peticiones con `fetch`.
- Manejo de datos en formato JSON.
- Operaciones CRUD.
- Hash de contraseñas.
- Autenticación con JWT.
- Variables de entorno.
- Manejo de errores.
- Diseño responsive.
- Integración entre Frontend y Backend.

---

## 👩‍💻 Desarrollo

Proyecto realizado como trabajo práctico integrador de desarrollo Backend.

Desarrollado por:

- **Sofía Mendoza**
- **Yamila Valdez Aguilar**

**Lara Stock** fue desarrollado como un sistema de gestión de inventario para Lara Pastelería, aplicando los conocimientos adquiridos durante la cursada.

---

## 💚 Lara Stock

> Control simple, claro y organizado de los insumos de Lara Pastelería.