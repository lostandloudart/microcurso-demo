# Brief maestro para un curso web de múltiples partes

## 1. Visión del proyecto

Crear un curso web amplio, dividido en múltiples partes, a partir de material bibliográfico seleccionado.

El contenido educativo debe construirse exclusivamente con la información presente en el material proporcionado. La inteligencia artificial puede organizar, explicar, resumir, relacionar y transformar pedagógicamente esa información, pero no debe agregar datos externos ni completar vacíos con conocimientos propios.

El resultado debe sentirse como un curso autónomo. En la experiencia del estudiante no se mencionan documentos, fuentes, páginas, bibliografía ni procesos de generación. Se presenta directamente el contenido educativo.

## 2. Objetivo de la experiencia

El curso debe:

- Ser claro para una persona que comienza desde cero.
- Desarrollar los temas con suficiente profundidad.
- Mantener el interés mediante una narración continua.
- Generar curiosidad y ganas de avanzar al siguiente capítulo.
- Combinar lectura, imágenes, observación, actividades y evaluación.
- Funcionar correctamente en computadoras, tablets y celulares.
- Ser accesible mediante teclado y tecnologías de asistencia.
- Poder alojarse gratuitamente en GitHub Pages y ser compatible con un alojamiento estático como Hostinger.

## 3. Regla principal sobre el contenido

Todo el curso debe basarse exclusivamente en el material bibliográfico entregado.

La IA puede:

- Reordenar la información para mejorar su comprensión.
- Convertir enumeraciones en explicaciones fluidas.
- Crear introducciones, transiciones y cierres narrativos.
- Explicar relaciones que ya estén contenidas en el material.
- Diseñar preguntas, actividades y ejercicios basados en esos contenidos.
- Crear definiciones simples sin incorporar información nueva.

La IA no puede:

- Agregar datos, ejemplos, cifras o categorías externas.
- Afirmar algo que no pueda justificarse con el material disponible.
- Inventar explicaciones para cubrir información faltante.
- Mezclar el contenido con conocimientos generales no incluidos en la selección bibliográfica.

## 4. Arquitectura general del curso

El curso grande se organiza en niveles:

```text
Curso completo
├── Parte 1
│   ├── Módulo 1
│   ├── Módulo 2
│   ├── Módulo 3
│   └── Evaluación de la parte
├── Parte 2
│   ├── Módulo 4
│   ├── Módulo 5
│   ├── Módulo 6
│   └── Evaluación de la parte
├── Parte 3
│   └── ...
└── Cierre y evaluación final
```

Cada parte debe tener:

- Una pregunta central.
- Un objetivo general.
- Una introducción narrativa.
- Entre tres y seis módulos relacionados.
- Una evaluación o actividad integradora.
- Un cierre que conecte con la siguiente parte.

## 5. Duración

Cada módulo debe durar entre 20 y 30 minutos.

La duración se define según la cantidad y la complejidad del contenido disponible. Un tema acotado puede resolverse en 20 minutos; un proceso con más conceptos, imágenes o relaciones puede extenderse hasta 30 minutos. No se debe alargar un módulo mediante repeticiones ni comprimir un tema que necesita mayor desarrollo.

Distribución sugerida:

| Bloque | Duración | Propósito |
|---|---:|---|
| Historia y explicación | 7-10 min | Introducir y desarrollar el tema |
| Conceptos principales | 4-6 min | Aclarar términos y relaciones |
| Observación guiada | 3-5 min | Leer imágenes, esquemas o ejemplos |
| Actividad de aplicación | 4-6 min | Recuperar y utilizar lo aprendido |
| Comprobación | 2-3 min | Verificar la comprensión |

Una parte formada por cuatro módulos tendrá una duración aproximada de 80 a 120 minutos, sin contar su evaluación integradora.

La duración elegida debe declararse al comienzo de cada módulo y coincidir con la cantidad real de lectura, observación, práctica y evaluación.

Criterio orientativo:

- **20 minutos:** una idea central, pocos conceptos y una actividad breve.
- **25 minutos:** varias ideas relacionadas, una imagen o comparación y una actividad de aplicación.
- **30 minutos:** un proceso complejo, múltiples conceptos, observación guiada y una actividad más desarrollada.

## 6. Estructura obligatoria de cada módulo

### 6.1. Apertura

- Número y nombre del capítulo.
- Duración estimada.
- Pregunta intrigante que abra el tema.
- Objetivo expresado desde lo que podrá hacer el estudiante.
- Distribución visual del tiempo estimado.

### 6.2. Escena inicial

Un párrafo narrativo breve que presente un misterio, una transformación, una decisión o una pregunta.

La escena debe despertar curiosidad sin anticipar toda la respuesta.

### 6.3. Desarrollo narrativo

El contenido no debe presentarse como una sucesión de definiciones aisladas. Debe construir una historia mediante:

- Preguntas que se responden progresivamente.
- Relaciones de causa, función, contraste o secuencia.
- Transiciones entre conceptos.
- Pequeños giros que abran el tema siguiente.
- Recapitulaciones breves antes de avanzar.

Cada sección debe desarrollar completamente una idea antes de introducir otra.

### 6.4. Conceptos importantes

Los términos que necesitan definición deben:

- Aparecer en negrita.
- Tener un subrayado o indicador visual de interactividad.
- Abrir una definición mediante un popup.
- Poder activarse con clic, toque o teclado.
- Cerrarse al tocar fuera o presionar Escape.

Las definiciones deben ser:

- Claras.
- Breves.
- Escritas con palabras sencillas.
- Limitadas a una idea principal.
- Comprensibles sin consultar otro apartado.
- Fieles al contenido disponible.

No se debe convertir cada palabra técnica en un popup. Se seleccionan únicamente los conceptos indispensables para comprender el módulo.

### 6.5. Imágenes

Las imágenes deben acompañar la explicación y no dominar la pantalla.

Cada imagen debe:

- Tener un tamaño proporcionado.
- Ser legible en computadora y celular.
- Incluir un texto alternativo descriptivo.
- Tener un epígrafe que explique qué se observa.
- Estar acompañada por preguntas o instrucciones de observación.
- Evitar referencias visibles a fuentes o números de página.

### 6.6. Observación guiada

La lectura visual debe pedir acciones concretas, por ejemplo:

- Localizar una estructura.
- Seguir una secuencia.
- Comparar dos formas.
- Reconocer diferencias.
- Relacionar una imagen con una explicación.
- Narrar con palabras propias lo que muestra un esquema.

### 6.7. Actividad de aplicación

La actividad debe requerir algo más que copiar una frase. Puede pedir:

- Relacionar estructura y función.
- Ordenar una secuencia.
- Construir una comparación.
- Explicar un proceso.
- Resolver una situación breve.
- Recuperar conceptos sin volver al texto.

Debe incluir una respuesta orientativa desplegable.

### 6.8. Comprobación

Cada módulo debe cerrar con preguntas breves.

La devolución debe ser directa:

- “Correcto”.
- “Revisá la respuesta e intentá nuevamente”.

No debe mostrar citas, páginas, fuentes ni referencias bibliográficas.

### 6.9. Puente narrativo

El final del módulo debe dejar una pregunta abierta o un problema que conduzca naturalmente al siguiente capítulo.

## 7. Estilo de redacción

La voz del curso debe ser:

- Cercana.
- Clara.
- Curiosa.
- Narrativa.
- Educativa sin sonar escolarizada en exceso.
- Precisa sin utilizar tecnicismos innecesarios.

Se debe evitar:

- Copiar párrafos extensos de forma literal.
- Acumular listas sin explicación.
- Repetir una definición con palabras apenas diferentes.
- Usar frases como “el documento dice”, “el material explica” o “según la fuente”.
- Interrumpir constantemente la historia con aclaraciones editoriales.
- Presentar bloques demasiado largos sin subtítulos o pausas.

## 8. Diseño visual

La interfaz debe ser limpia y consistente.

Principios:

- Una jerarquía clara entre parte, módulo, sección y actividad.
- Anchos de lectura cómodos.
- Espacios regulares entre bloques.
- Imágenes contenidas y centradas.
- Tarjetas visuales para actividades, conceptos y cierres.
- Colores con suficiente contraste.
- Ninguna superposición entre textos, números, imágenes o controles.
- Ningún desplazamiento horizontal accidental.

En celular:

- Los encabezados se apilan verticalmente.
- Las tablas se transforman en fichas.
- Las imágenes reducen su tamaño.
- Los popups aparecen como tarjetas inferiores.
- Los controles mantienen un área táctil cómoda.

## 9. Navegación de un curso grande

La página inicial debe mostrar:

- Título general del curso.
- Descripción breve.
- Duración total estimada.
- Cantidad de partes y módulos.
- Progreso general.
- Mapa completo del recorrido.

Cada parte debe tener su propia portada con:

- Nombre de la parte.
- Pregunta central.
- Objetivo.
- Duración.
- Módulos incluidos.
- Estado de avance.

Para un curso extenso conviene utilizar varias páginas:

```text
index.html                 Portada general
partes/parte-01.html       Portada de la parte 1
modulos/modulo-01.html     Primer módulo
modulos/modulo-02.html     Segundo módulo
evaluaciones/parte-01.html Evaluación integradora
```

Esto evita una única página excesivamente larga y permite continuar el curso con mayor facilidad.

## 10. Progreso del estudiante

El sitio debe recordar localmente:

- Módulos visitados.
- Evaluaciones completadas.
- Partes terminadas.
- Porcentaje general de avance.

En una primera versión gratuita puede utilizarse el almacenamiento local del navegador. Esto no requiere cuentas, servidor ni base de datos.

Limitación: el progreso queda guardado únicamente en ese navegador y dispositivo.

## 11. Publicación

La primera versión puede construirse como un sitio estático con:

- HTML.
- CSS.
- JavaScript.
- Imágenes optimizadas.

Opciones de alojamiento:

- GitHub Pages para publicación gratuita.
- Hostinger mediante la carga de los mismos archivos en la carpeta pública del sitio.

El proyecto no debe depender de servicios pagos para funcionar.

## 12. Flujo de producción con inteligencia artificial

### Etapa 1. Selección

- Reunir el material autorizado.
- Definir qué archivos pertenecen al curso.
- Excluir borradores, duplicados o fuentes no aprobadas.

### Etapa 2. Extracción

- Extraer el texto.
- Identificar títulos, conceptos, procesos, clasificaciones, ejemplos e imágenes.
- Registrar qué contenido puede utilizarse.

### Etapa 3. Mapa conceptual

- Agrupar temas relacionados.
- Detectar dependencias entre conceptos.
- Ordenar desde lo fundamental hacia lo complejo.
- Identificar posibles partes y módulos.

### Etapa 4. Diseño pedagógico

- Formular el objetivo general.
- Definir una pregunta central por parte.
- Definir una pregunta narrativa por módulo.
- Distribuir el contenido en módulos de 20 a 30 minutos.
- Diseñar observaciones, actividades y evaluaciones.

### Etapa 5. Redacción

- Escribir primero el recorrido narrativo.
- Desarrollar cada concepto con profundidad suficiente.
- Crear transiciones.
- Seleccionar términos para los popups.
- Redactar definiciones simples.

### Etapa 6. Construcción web

- Crear las páginas.
- Incorporar navegación y progreso.
- Optimizar imágenes.
- Implementar interacciones accesibles.

### Etapa 7. Control de fidelidad

- Verificar cada afirmación contra el material autorizado.
- Eliminar cualquier dato agregado involuntariamente.
- Confirmar que las actividades puedan resolverse con el contenido del curso.

### Etapa 8. Control visual y funcional

- Probar computadora, tablet y celular.
- Revisar superposiciones y desbordes.
- Probar popups con ratón, toque y teclado.
- Comprobar cuestionarios y progreso.
- Revisar textos alternativos de las imágenes.

### Etapa 9. Publicación

- Publicar una versión de prueba.
- Revisar la experiencia completa.
- Corregir problemas.
- Publicar la versión final.

## 13. Archivos recomendados para escalar el proyecto

```text
curso/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── data/
│   ├── course.json
│   ├── glossary.json
│   └── progress-schema.json
├── partes/
├── modulos/
├── evaluaciones/
└── documentos-internos/
    ├── mapa-de-contenidos.md
    ├── matriz-de-fidelidad.md
    └── guion-narrativo.md
```

Los archivos de control interno no se muestran al estudiante. Sirven para registrar el origen y la validación del contenido durante la producción.

## 14. Información necesaria para diseñar el curso completo

Antes de construir la arquitectura definitiva se debe definir:

1. Tema general del curso.
2. Perfil de los estudiantes.
3. Conocimientos previos esperados.
4. Cantidad aproximada de material bibliográfico.
5. Número deseado de partes.
6. Duración total esperada.
7. Tipo de evaluación final.
8. Necesidad de certificado.
9. Necesidad de cuentas de usuario o progreso entre dispositivos.
10. Identidad visual, nombre y marca del curso.

## 15. Próximo paso recomendado

Crear un inventario del material bibliográfico y una tabla con estas columnas:

| Archivo | Tema principal | Conceptos | Procesos | Imágenes útiles | Posible parte | Posible módulo |
|---|---|---|---|---|---|---|

A partir de ese inventario se puede diseñar el mapa completo del curso antes de redactar nuevos módulos.
