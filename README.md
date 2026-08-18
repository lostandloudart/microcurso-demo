# De la planta a la esencia

Proyecto editorial y sitio web de un curso de cosmética natural ligada a aceites esenciales.

## Accesos rápidos

- [Brief general](00_GESTION/BRIEF_CURSO.md)
- [Estado del curso](00_GESTION/ESTADO_DEL_CURSO.md)
- [Mapa curricular activo](00_GESTION/MAPA_CURRICULAR.md)
- [Guía para armar nuevos módulos](00_GESTION/GUIA_ARMADO_MODULOS.md)
- [Índice de contenidos](02_CONTENIDOS/INDICE_CONTENIDOS.md)
- [Inventario de imágenes](03_IMAGENES/INVENTARIO_IMAGENES.md)
- [Revisión de contenido](04_REVISION/CONTROL_CONTENIDO.md)
- [Revisión de seguridad](04_REVISION/CONTROL_SEGURIDAD.md)
- [Revisión visual](04_REVISION/CONTROL_VISUAL.md)
- [Sitio publicable](docs/index.html)

## Organización

- `00_GESTION`: decisiones editoriales, estilo, estado y cambios.
- `01_FUENTES`: PDF de trabajo, manifiesto y trazabilidad.
- `02_CONTENIDOS`: contenidos activos de la nueva estructura por partes y módulos.
- `00_GESTION/ARCHIVO_V1`: respaldo de la estructura anterior; no alimenta el sitio.
- `03_IMAGENES`: originales, recortes, versiones web e inventario.
- `04_REVISION`: controles y pendientes.
- `scripts`: generación y validación reproducible.
- `docs`: sitio estático publicado en GitHub Pages.

Los PDF y recortes de trabajo permanecen en Dropbox y están excluidos de Git. Los textos editables, inventarios, versiones visuales aprobadas y el sitio sí se versionan.

## Comandos

```bash
node scripts/generar-inventarios.js
node scripts/construir-sitio.js
node scripts/validar-contenidos.js
```

Para revisar el sitio localmente:

```bash
python3 -m http.server 8000 --directory docs
```

Después visitar `http://localhost:8000`.
