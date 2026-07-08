# 🌐 tlon-web-page
Código fuente para la página web del Grupo de Investigación en Redes de Telecomunicaciones Dinámicas y Lenguajes de Programación Distribuidos, TLÖN - https://tlon.unal.edu.co/

## 📐 Lineamientos de diseño

Todo lo visual (colores, tipografía, logos, banners institucionales, uso del escudo,
etc.) debe seguir el manual oficial de identidad de la Universidad Nacional:
**[identidad.unal.edu.co](https://identidad.unal.edu.co/)**.

## 🏗️ Arquitectura del código

Antes de tocar el HTML/JS, lee [ARCHITECTURE.md](./ARCHITECTURE.md) — explica los
componentes reutilizables (banner, menú, panel de accesibilidad), por qué están
armados así, y el checklist para agregar una página nueva sin romper la consistencia
entre páginas.

## 🚀 Entorno de prueba local
Puedes levantar un entorno de prueba de forma rápida usando Live Server (extensión de VSCode) o Docker con Nginx.

### Opción 1: Extensión Live Server (VSCode)

Ideal para desarrollo frontend rápido con recarga automática.

1. Instala la extensión Live Server [[VSC Market](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)] en tu entorno de VSCode.
2. Abre la raíz del proyecto (donde está el archivo `index.html`).
3. Haz clic derecho sobre el archivo `index.html` y selecciona **Open with Live Server**.
4. La página se abrirá automáticamente en http://127.0.0.1:5500.

### Opción 2: Docker con Nginx

Ideal para pruebas más realistas o entornos que simulan producción.

1. Asegúrate de tener Docker instalado y corriendo.
2. En la raíz del proyecto (al mismo nivel del archivo `index.html`), ejecuta:
```bash
docker run --name mi-servidor -p 8080:80 -v "$(pwd)":/usr/share/nginx/html:ro -d nginx:alpine
```
3. Abre tu navegador en http://localhost:8080.
4. Para detener el contenedor:
```bash
docker stop mi-servidor
```
5. Para eliminarlo:
```bash
docker rm mi-servidor
```

## 📒 Manual de Nomenclatura de Commits:

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)