# -*- coding: utf-8 -*-
"""Genera el Museo de la Wiki a partir del export de Discord.

Uso (desde la raíz del proyecto):
    python3 scripts/museo/generar_museo.py

- Lee export/museo-discord/mensajes.json y export/museo-discord/archivos/
- Copia las imágenes optimizadas para web (solo se reducen y comprimen,
  sin cambiar su contenido) a public/wiki/museo/<entrada>/
- Copia audio, video y otros archivos tal cual
- Escribe src/data/museo.js
"""
import json
import os
import shutil
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from museo_spec import ENTRADAS  # noqa: E402

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
EXPORT = os.path.join(RAIZ, 'export', 'museo-discord')
PUBLICO = os.path.join(RAIZ, 'public', 'wiki', 'museo')
DATOS = os.path.join(RAIZ, 'src', 'data', 'museo.js')

LADO_MAX = 1600       # px, lado mayor de imágenes normales
ANCHO_LARGAS = 1000   # px, ancho máximo de capturas muy altas
CALIDAD = 82


def tiene_transparencia(im):
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        a = im.convert('RGBA').getchannel('A')
        return a.getextrema()[0] < 255
    return False


def optimizar(origen, destino_sin_ext):
    im = Image.open(origen)
    im.load()
    w, h = im.size
    if h / w > 2.5:
        escala = min(1, ANCHO_LARGAS / w)
    else:
        escala = min(1, LADO_MAX / max(w, h))
    if escala < 1:
        im = im.resize((round(w * escala), round(h * escala)), Image.LANCZOS)
    if tiene_transparencia(im):
        ruta = destino_sin_ext + '.png'
        im.convert('RGBA').save(ruta, optimize=True)
    else:
        ruta = destino_sin_ext + '.jpg'
        im.convert('RGB').save(ruta, quality=CALIDAD, optimize=True, progressive=True)
    return os.path.basename(ruta)


def js(s):
    return json.dumps(s, ensure_ascii=False)


def main():
    mensajes = json.load(open(os.path.join(EXPORT, 'mensajes.json'), encoding='utf-8'))['mensajes']
    if os.path.isdir(PUBLICO):
        shutil.rmtree(PUBLICO)
    os.makedirs(PUBLICO)

    salida = []
    for e in ENTRADAS:
        carpeta = os.path.join(PUBLICO, e['slug'])
        os.makedirs(carpeta)
        galeria = []
        for n, (msg, k, pie) in enumerate(e.get('imgs', []), 1):
            archivo = mensajes[msg]['archivos'][k]
            nombre = optimizar(os.path.join(EXPORT, 'archivos', archivo), os.path.join(carpeta, '%02d' % n))
            galeria.append((f"{e['slug']}/{nombre}", pie))
        medios = []
        for tipo, msg, k, nombre, titulo in e.get('medios', []):
            archivo = mensajes[msg]['archivos'][k]
            shutil.copyfile(os.path.join(EXPORT, 'archivos', archivo), os.path.join(carpeta, nombre))
            medios.append((tipo, f"{e['slug']}/{nombre}", titulo))
        salida.append((e, galeria, medios))

    L = []
    L.append('// ============================================================================')
    L.append('//  MUSEO de la Wiki (/wiki/museo)')
    L.append('// ============================================================================')
    L.append('//  Generado con scripts/museo/generar_museo.py a partir del canal #museo de')
    L.append('//  Discord (las curiosidades y su texto están en scripts/museo/museo_spec.py).')
    L.append('//  Las imágenes están en public/wiki/museo/<entrada>/.')
    L.append('//')
    L.append('//  Campos: nombre, imagen, serie, descripcion y opcionalmente')
    L.append('//    galeria: [{ src, pie }]   imágenes extra con su pie de foto')
    L.append('//    medios:  [{ tipo: "video" | "audio" | "archivo", src, titulo }]')
    L.append('//    enlaces: [{ texto, url }]')
    L.append('//  serie: DMB, LB, CW, Creepy, PD, JA o TMD (general).')
    L.append('// ============================================================================')
    L.append("import ArenitaPatricioCalamardo from '../assets/images/wiki/museo/arenita-patricio-calamardo.png';")
    L.append('')
    L.append('const M = `${process.env.PUBLIC_URL}/wiki/museo`;')
    L.append('')
    L.append('const museo = [')
    L.append('  {')
    L.append("    nombre: 'Arenita, Patricio y Calamardo en LegoBob??',")
    L.append('    imagen: ArenitaPatricioCalamardo,')
    L.append("    serie: 'LB',")
    L.append("    descripcion: 'Información del personaje (Fuera de la serie): Su aparición en la serie no debería ser posible puesto que Legobob perdió todo contacto de su anterior vida en el borrado de memoria de Skelto, Rodrigo justificó esta incoherencia con el hecho de que en ese momento no tenía una historia pre-establecida para Legobob.',")
    L.append('  },')
    for e, galeria, medios in salida:
        L.append('  {')
        L.append(f"    nombre: {js(e['nombre'])},")
        if galeria:
            L.append(f"    imagen: `${{M}}/{galeria[0][0]}`,")
        L.append(f"    serie: {js(e['serie'])},")
        L.append(f"    descripcion: {js(e['descripcion'])},")
        if galeria:
            L.append('    galeria: [')
            for src, pie in galeria:
                L.append(f"      {{ src: `${{M}}/{src}`, pie: {js(pie)} }},")
            L.append('    ],')
        if medios:
            L.append('    medios: [')
            for tipo, src, titulo in medios:
                L.append(f"      {{ tipo: {js(tipo)}, src: `${{M}}/{src}`, titulo: {js(titulo)} }},")
            L.append('    ],')
        if e.get('enlaces'):
            L.append('    enlaces: [')
            for texto, url in e['enlaces']:
                L.append(f"      {{ texto: {js(texto)}, url: {js(url)} }},")
            L.append('    ],')
        L.append('  },')
    L.append('];')
    L.append('')
    L.append('export default museo;')
    L.append('')
    open(DATOS, 'w', encoding='utf-8').write('\n'.join(L))

    total = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(PUBLICO) for f in fs)
    print(f'{len(salida)} entradas, {sum(len(g) for _, g, _ in salida)} imágenes, {total / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
