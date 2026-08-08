# 🍰 Lara Stock

Sistema de gestión de stock desarrollado para **Lara Pastelería**, pensado para facilitar el control de insumos utilizados en la producción diaria.

La aplicación permite administrar el inventario, registrar entradas y salidas de productos y consultar el historial de movimientos, manteniendo actualizado el stock disponible.

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

La búsqueda se realiza dinámicamente para mejorar la experiencia de uso.

También se puede acceder rápidamente a los productos según su estado utilizando las tarjetas de resumen.

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
- Errores de validación o conexión.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express

### Comunicación entre Frontend y Backend

El frontend se comunica con el backend mediante una **API REST**, utilizando `fetch`.

Los datos son enviados y recibidos en formato **JSON**.

---

## 🔗 API REST

La API de Lara Stock permite administrar los insumos y movimientos del inventario.

### Insumos

#### Obtener insumos

```http
GET /api/items
```

Obtiene la lista de insumos registrados.

También permite aplicar filtros desde el frontend.

#### Crear un insumo

```http
POST /api/items
```

Permite registrar un nuevo insumo.

#### Actualizar un insumo

```http
PUT /api/items/:id
```

Permite modificar los datos de un insumo existente.

#### Eliminar un insumo

```http
DELETE /api/items/:id
```

Permite eliminar un insumo.

---

### Resumen de stock

```http
GET /api/items/resumen
```

Devuelve información general del inventario:

- Total de insumos.
- Insumos con stock bajo.
- Insumos sin stock.

---

### Movimientos

#### Obtener movimientos

```http
GET /api/movements
```

Obtiene el historial de entradas y salidas del inventario.

#### Registrar un movimiento

```http
POST /api/movements
```

Permite registrar una nueva entrada o salida de stock.

Al registrar el movimiento, la cantidad disponible del insumo se actualiza automáticamente.

---

## 📂 Estructura general del proyecto

```text
lara-stock/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend/
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

### 2. Instalar y ejecutar el Backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm run dev
```

El backend se ejecuta localmente en:

```text
http://localhost:4000
```

---

### 3. Ejecutar el Frontend

Abrir el archivo:

```text
frontend/index.html
```

También puede utilizarse la extensión **Live Server** de Visual Studio Code para ejecutar el frontend.

El frontend se conecta con la API ejecutándose en el puerto `4000`.

---

## ✅ Validaciones

El sistema incluye distintas validaciones para mantener la consistencia del inventario.

Entre ellas:

- Campos obligatorios.
- Cantidades mayores a 0 para movimientos.
- Cantidades enteras cuando la unidad seleccionada es `unidades`.
- Cantidades decimales para unidades de medida que lo permiten.
- Control del stock disponible.
- Prevención de salidas superiores al stock existente.
- Confirmación antes de eliminar un insumo.
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

- Manipulación del DOM.
- Eventos en JavaScript.
- Formularios.
- Validaciones.
- Métodos HTTP.
- API REST.
- Peticiones con `fetch`.
- Manejo de datos en formato JSON.
- Operaciones CRUD.
- Manejo de errores.
- Diseño responsive.
- Organización del código.
- Integración entre Frontend y Backend.

---

## 👩‍💻 Desarrollo

Proyecto realizado como trabajo práctico de desarrollo web.

**Lara Stock** fue desarrollado como un sistema de gestión de inventario para Lara Pastelería, aplicando los conocimientos adquiridos durante la cursada.

---

## 💚 Lara Stock

> Control simple, claro y organizado de los insumos de Lara Pastelería.