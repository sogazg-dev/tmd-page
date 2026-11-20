#!/usr/bin/env python3
"""Dibuja el mapa del Mundo real (Club de Comedia Bickolt y Hotel Denson).

Uso (desde la raíz del proyecto):
  python3 scripts/wiki-mapa/mundo_real.py src/assets/images/wiki/mapa

Una ciudad (sin mar) con el mismo estilo que el mapa del Reino Champiñón:
texturas pintadas, edificios en vista inclinada con sombra solo hacia la
derecha (sin sombra abajo, para que no parezcan flotar) y una rosa de los vientos. La tubería es la misma del mapa del Reino
(tubo.png, recortada de ese mapa).
Se dibuja al doble de tamaño y se reduce para suavizar las orillas.
"""
import math
import random
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = 2                      # se dibuja al doble
W, H = 1600 * S, 1200 * S
random.seed(7)
np.random.seed(7)
FUENTE = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'

MAR = (36, 78, 96)
MAR_CLARO = (58, 112, 124)
PASTO = (140, 127, 58)
TINTA = (24, 20, 14)


def ruido(w, h, escalas=((8, 0.5), (32, 0.3), (128, 0.2))):
    """Ruido suave (varias escalas) entre -1 y 1."""
    total = np.zeros((h, w))
    for paso, peso in escalas:
        r = np.random.rand(h // paso + 2, w // paso + 2)
        img = Image.fromarray((r * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
        total += (np.asarray(img) / 127.5 - 1) * peso
    return total


def textura(color, w, h, fuerza=22, escalas=None):
    n = ruido(w, h, escalas) if escalas else ruido(w, h)
    arr = np.clip(np.array(color)[None, None, :] + n[..., None] * fuerza, 0, 255).astype('uint8')
    return Image.fromarray(arr, 'RGB')


def sombra(capa, forma, desp=(10, 12), radio=8, alfa=120):
    """Agrega a `capa` (RGBA) la sombra de una forma (lista de polígonos)."""
    m = Image.new('L', capa.size, 0)
    d = ImageDraw.Draw(m)
    for p in forma:
        d.polygon([(x + desp[0] * S, y + desp[1] * S) for x, y in p], fill=alfa)
    m = m.filter(ImageFilter.GaussianBlur(radio * S))
    negro = Image.new('RGBA', capa.size, (20, 16, 8, 255))
    capa.paste(negro, (0, 0), m)


def caja(d, x, y, w, h, alto, frente, techo, lado=None, contorno=TINTA):
    """Edificio en vista inclinada: frente (abajo) + techo (arriba)."""
    techo_p = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
    frente_p = [(x, y + h), (x + w, y + h), (x + w, y + h + alto), (x, y + h + alto)]
    d.polygon(frente_p, fill=frente, outline=contorno, width=2 * S)
    d.polygon(techo_p, fill=techo, outline=contorno, width=2 * S)
    return techo_p, frente_p


def ventanas(d, x, y, w, alto, filas, cols, color, marco=TINTA):
    vw = w / (cols * 2 + 1)
    vh = alto / (filas * 2 + 1)
    for f in range(filas):
        for c in range(cols):
            x0 = x + vw * (1 + 2 * c)
            y0 = y + vh * (1 + 2 * f)
            d.rectangle((x0, y0, x0 + vw, y0 + vh), fill=color, outline=marco, width=S)


def arbol(d, x, y, r):
    tonos = [(46, 70, 26), (62, 92, 34), (84, 116, 44)]
    for i, t in enumerate(tonos):
        rr = r * (1 - i * 0.22)
        ox, oy = -i * r * 0.12, -i * r * 0.14
        for _ in range(6):
            a = random.random() * math.tau
            px = x + ox + math.cos(a) * rr * 0.35
            py = y + oy + math.sin(a) * rr * 0.3
            q = rr * random.uniform(0.5, 0.65)
            d.ellipse((px - q, py - q, px + q, py + q), fill=t)
    d.ellipse((x - r * 0.95, y - r * 0.9, x + r * 0.95, y + r * 0.9), outline=TINTA, width=S)


def rosa_vientos(d, cx, cy, r):
    oro, oro_o = (196, 160, 92), (120, 92, 46)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(52, 46, 38), outline=oro, width=5 * S)
    d.ellipse((cx - r * 0.86, cy - r * 0.86, cx + r * 0.86, cy + r * 0.86), outline=(222, 214, 196), width=2 * S)
    for i in range(16):
        a = i / 16 * math.tau
        d.line((cx + math.cos(a) * r * 0.86, cy + math.sin(a) * r * 0.86, cx + math.cos(a) * r * 0.94, cy + math.sin(a) * r * 0.94), fill=oro, width=2 * S)
    for i in range(8):
        a = i / 8 * math.tau - math.pi / 2
        largo = r * (0.82 if i % 2 == 0 else 0.5)
        ancho = r * 0.12
        punta = (cx + math.cos(a) * largo, cy + math.sin(a) * largo)
        izq = (cx + math.cos(a - math.pi / 2) * ancho, cy + math.sin(a - math.pi / 2) * ancho)
        der = (cx + math.cos(a + math.pi / 2) * ancho, cy + math.sin(a + math.pi / 2) * ancho)
        d.polygon([(cx, cy), izq, punta], fill=oro)
        d.polygon([(cx, cy), der, punta], fill=oro_o)
    d.ellipse((cx - r * 0.07, cy - r * 0.07, cx + r * 0.07, cy + r * 0.07), fill=oro)



TUBO = Path(__file__).with_name('tubo.png')

# calles: centro de cada calle (vertical x / horizontal y) en pixeles de 1600 x 1200
CALLES_X = [430, 960]
CALLES_Y = [350, 830]
ANCHO_CALLE = 74


def manzanas():
    """Rectángulos de las manzanas entre las calles."""
    xs = [-40] + CALLES_X + [1640]
    ys = [-40] + CALLES_Y + [1240]
    out = {}
    for j in range(len(ys) - 1):
        for i in range(len(xs) - 1):
            x0 = xs[i] + (ANCHO_CALLE // 2 if i else 0)
            x1 = xs[i + 1] - (ANCHO_CALLE // 2 if i + 1 < len(xs) - 1 else 0)
            y0 = ys[j] + (ANCHO_CALLE // 2 if j else 0)
            y1 = ys[j + 1] - (ANCHO_CALLE // 2 if j + 1 < len(ys) - 1 else 0)
            out[(i, j)] = (x0, y0, x1, y1)
    return out


def revisar_manzanas(B, edificios, club, hotel, margen=24):
    """Avisa si un edificio se sale de su manzana (se metería a la calle)."""
    cajas = [(x, y, x + w, y + f + a) for (x, y, w, f, a, *_r) in edificios]
    cajas += [(x, y, x + w, y + f + a) for (x, y, w, f, a) in (club, hotel)]
    for (x0, y0, x1, y1) in cajas:
        ok = any(x0 >= bx0 + margen and x1 <= bx1 - margen and y0 >= by0 + margen and y1 <= by1 - margen
                 for (bx0, by0, bx1, by1) in B.values())
        if not ok:
            raise SystemExit(f'Edificio fuera de su manzana: {(x0, y0, x1, y1)}')


def main(salida):
    salida = Path(salida)
    salida.mkdir(parents=True, exist_ok=True)
    B = manzanas()
    asfalto, banqueta = (62, 62, 66), (156, 150, 132)
    amarillo = (214, 190, 58)

    # --- asfalto en todo el fondo y banquetas en cada manzana
    img = textura(asfalto, W, H, 10, ((4, 0.6), (16, 0.4))).convert('RGBA')
    d = ImageDraw.Draw(img)
    for (x0, y0, x1, y1) in B.values():
        d.rectangle((x0 * S, y0 * S, x1 * S, y1 * S), fill=banqueta, outline=(110, 106, 92), width=2 * S)
    # pasto / patio dentro de cada manzana
    pasto = textura(PASTO, W, H, 24)
    mk = Image.new('L', (W, H), 0)
    dm = ImageDraw.Draw(mk)
    for (x0, y0, x1, y1) in B.values():
        dm.rectangle(((x0 + 14) * S, (y0 + 14) * S, (x1 - 14) * S, (y1 - 14) * S), fill=255)
    img.paste(pasto.convert('RGBA'), (0, 0), mk)
    d = ImageDraw.Draw(img)

    # --- rayas de las calles y pasos de cebra
    for y in CALLES_Y:
        for x in range(0, 1600, 48):
            if any(abs(x + 13 - cx) < 60 for cx in CALLES_X):
                continue
            d.rectangle((x * S, (y - 2) * S, (x + 26) * S, (y + 2) * S), fill=amarillo)
    for x in CALLES_X:
        for y in range(0, 1200, 48):
            if any(abs(y + 13 - cy) < 60 for cy in CALLES_Y):
                continue
            d.rectangle(((x - 2) * S, y * S, (x + 2) * S, (y + 26) * S), fill=amarillo)
    blanco = (214, 212, 200)
    for cx in CALLES_X:
        for cy in CALLES_Y:
            for k in range(6):
                o = -30 + k * 12
                d.rectangle(((cx - 62) * S, (cy + o) * S, (cx - 44) * S, (cy + o + 6) * S), fill=blanco)
                d.rectangle(((cx + 44) * S, (cy + o) * S, (cx + 62) * S, (cy + o + 6) * S), fill=blanco)
                d.rectangle(((cx + o) * S, (cy - 62) * S, (cx + o + 6) * S, (cy - 44) * S), fill=blanco)
                d.rectangle(((cx + o) * S, (cy + 44) * S, (cx + o + 6) * S, (cy + 62) * S), fill=blanco)

    # --- edificios: (x, y, ancho, fondo, alto, frente, techo, tipo)
    edificios = [
        # manzana de arriba a la izquierda: departamentos
        (40, 40, 150, 90, 110, (170, 150, 120), (92, 84, 78), 'depa'),
        (222, 80, 138, 80, 80, (150, 92, 70), (120, 60, 46), 'casa'),
        # arriba al centro: tiendas
        (500, 50, 180, 80, 90, (186, 176, 150), (70, 80, 96), 'tienda'),
        (720, 60, 175, 90, 120, (160, 160, 168), (84, 88, 100), 'depa'),
        # arriba a la derecha: oficinas (la rosa de los vientos va encima)
        (1030, 60, 170, 90, 120, (150, 160, 176), (70, 78, 92), 'depa'),
        (1228, 140, 115, 70, 70, (176, 150, 118), (130, 70, 50), 'casa'),
        # en medio al centro: departamentos y casas
        (510, 420, 170, 90, 110, (176, 160, 130), (100, 92, 84), 'depa'),
        (720, 450, 170, 80, 80, (150, 92, 70), (120, 60, 46), 'tienda'),
        (520, 630, 120, 70, 60, (196, 182, 150), (70, 88, 120), 'casa'),
        (680, 630, 120, 70, 60, (196, 182, 150), (148, 70, 50), 'casa'),
        # en medio a la derecha: casas
        (1040, 420, 130, 80, 60, (196, 182, 150), (148, 70, 50), 'casa'),
        (1220, 430, 130, 80, 60, (196, 182, 150), (70, 88, 120), 'casa'),
        (1400, 420, 140, 80, 70, (180, 168, 140), (120, 92, 60), 'casa'),
        (1040, 590, 150, 90, 80, (160, 160, 168), (84, 88, 100), 'depa'),
        # abajo a la izquierda y al centro
        (40, 900, 150, 80, 90, (170, 150, 120), (92, 84, 78), 'depa'),
        (230, 930, 136, 80, 60, (196, 182, 150), (148, 70, 50), 'casa'),
        (60, 1080, 130, 70, 50, (196, 182, 150), (70, 88, 120), 'casa'),
    ]
    # Club (en medio a la izquierda) y hotel (abajo a la derecha): bien separados
    club = (40, 430, 325, 150, 100)
    hotel = (1080, 892, 270, 115, 170)

    revisar_manzanas(B, edificios, club, hotel)
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # la sombra se encoge arriba y abajo lo mismo que difumina: así solo se ve
    # a la derecha del edificio
    E = 12
    caja_sombra = lambda x, y, w, alto: [(x * S, (y + E) * S), ((x + w) * S, (y + E) * S), ((x + w) * S, (y + alto - E) * S), (x * S, (y + alto - E) * S)]
    formas = [caja_sombra(x, y, w, f + a) for (x, y, w, f, a, *_r) in edificios]
    for (x, y, w, f, a) in (club, hotel):
        formas.append(caja_sombra(x, y, w, f + a))
    sombra(capa, formas, (16, 0), 6, 150)
    arboles = [
        # parque de abajo al centro
        (530, 920, 30), (600, 960, 34), (680, 920, 28), (760, 980, 32), (840, 930, 30), (560, 1040, 30),
        (650, 1080, 34), (740, 1060, 28), (830, 1080, 32), (880, 1010, 26),
        # sueltos
        (205, 266, 18), (1530, 266, 20), (1460, 640, 26), (80, 732, 22), (300, 1100, 26), (1470, 1140, 26),
        (1430, 920, 22), (702, 258, 16),
    ]
    sombra(capa, [[(x * S + math.cos(t) * r * S, y * S + math.sin(t) * max(4, r - 12) * S) for t in np.linspace(0, math.tau, 24)] for x, y, r in arboles], (14, 0), 6, 140)
    img.alpha_composite(capa)
    d = ImageDraw.Draw(img)

    # caminito del parque
    d.ellipse((560 * S, 950 * S, 860 * S, 1060 * S), outline=(190, 176, 140), width=10 * S)
    d.ellipse((690 * S, 985 * S, 730 * S, 1025 * S), fill=(90, 140, 170), outline=TINTA, width=2 * S)  # fuente

    for (x, y, w, f, a, frente, techo, tipo) in edificios:
        x, y, w, f, a = x * S, y * S, w * S, f * S, a * S
        caja(d, x, y, w, f, a, frente, techo)
        if tipo == 'casa':
            d.line((x + w / 2, y, x + w / 2, y + f), fill=tuple(max(0, c - 40) for c in techo), width=2 * S)
            ventanas(d, x, y + f, w, a, 1, 3, (72, 82, 92))
            d.rectangle((x + w * 0.42, y + f + a * 0.45, x + w * 0.58, y + f + a), fill=(84, 56, 36), outline=TINTA, width=S)
        elif tipo == 'tienda':
            ventanas(d, x, y + f, w, a * 0.45, 1, 4, (72, 82, 92))
            d.rectangle((x + 6 * S, y + f + a * 0.5, x + w - 6 * S, y + f + a * 0.62), fill=(176, 50, 44))  # toldo
            d.rectangle((x + w * 0.1, y + f + a * 0.66, x + w * 0.9, y + f + a), fill=(120, 150, 170), outline=TINTA, width=S)
        else:
            ventanas(d, x, y + f, w, a * 0.9, max(2, int(a / (40 * S))), 4, (110, 140, 168))
            d.rectangle((x + 10 * S, y + 10 * S, x + 40 * S, y + 34 * S), fill=(120, 122, 124), outline=TINTA, width=S)

    # --- Club de comedia Bickolt: ladrillo con marquesina
    cx, cy, cw, ch, calto = (v * S for v in club)
    caja(d, cx, cy, cw, ch, calto, (150, 74, 48), (78, 70, 66))
    for yy in range(int(cy + ch + 6 * S), int(cy + ch + calto), 9 * S):
        d.line((cx + 2 * S, yy, cx + cw - 2 * S, yy), fill=(110, 50, 32), width=S)
    mx0, my0, mx1, my1 = cx + 40 * S, cy + ch - 26 * S, cx + cw - 40 * S, cy + ch + 34 * S
    d.rectangle((mx0, my0, mx1, my1), fill=(28, 24, 22), outline=(214, 180, 90), width=3 * S)
    for i in range(18):
        fx = mx0 + 8 * S + (mx1 - mx0 - 16 * S) * i / 17
        for fy in (my0 + 6 * S, my1 - 6 * S):
            d.ellipse((fx - 3 * S, fy - 3 * S, fx + 3 * S, fy + 3 * S), fill=(255, 226, 120))
    f = ImageFont.truetype(FUENTE, 30 * S)
    tw = d.textlength('BICKOLT', font=f)
    d.text(((mx0 + mx1) / 2 - tw / 2, my0 + 13 * S), 'BICKOLT', font=f, fill=(238, 70, 60))
    d.rectangle((cx + cw / 2 - 26 * S, cy + ch + 46 * S, cx + cw / 2 + 26 * S, cy + ch + calto), fill=(40, 26, 20), outline=TINTA, width=S)
    for px in (cx + 36 * S, cx + cw - 70 * S):
        d.rectangle((px, cy + ch + 46 * S, px + 34 * S, cy + ch + 80 * S), fill=(226, 214, 180), outline=TINTA, width=S)
        d.rectangle((px + 6 * S, cy + ch + 52 * S, px + 28 * S, cy + ch + 64 * S), fill=(176, 50, 44))
    for ax in (cx + 30 * S, cx + 200 * S):
        d.rectangle((ax, cy + 30 * S, ax + 50 * S, cy + 70 * S), fill=(120, 122, 124), outline=TINTA, width=S)
    # bicicleta en la banqueta
    bx, by = cx + cw - 70 * S, cy + ch + calto + 34 * S
    for k in (0, 36):
        d.ellipse((bx + k * S - 14 * S, by - 14 * S, bx + k * S + 14 * S, by + 14 * S), outline=(216, 214, 220), width=2 * S)
    d.line((bx, by, bx + 14 * S, by - 22 * S, bx + 30 * S, by - 22 * S, bx + 36 * S, by), fill=(216, 214, 220), width=2 * S)

    # --- Hotel Denson
    hx, hy, hw, hh, halto = (v * S for v in hotel)
    caja(d, hx, hy, hw, hh, halto, (176, 168, 150), (88, 96, 112))
    ventanas(d, hx, hy + hh, hw, halto * 0.8, 4, 6, (120, 156, 186))
    d.rectangle((hx + hw / 2 - 28 * S, hy + hh + halto - 46 * S, hx + hw / 2 + 28 * S, hy + hh + halto), fill=(60, 44, 32), outline=TINTA, width=S)
    d.rectangle((hx + hw / 2 - 60 * S, hy + hh + halto - 54 * S, hx + hw / 2 + 60 * S, hy + hh + halto - 44 * S), fill=(140, 40, 40))
    lx0, ly0 = hx + 40 * S, hy + 22 * S
    d.rectangle((lx0, ly0, hx + hw - 40 * S, ly0 + 54 * S), fill=(30, 30, 40), outline=(214, 180, 90), width=3 * S)
    f2 = ImageFont.truetype(FUENTE, 34 * S)
    tw = d.textlength('HOTEL', font=f2)
    d.text((hx + hw / 2 - tw / 2, ly0 + 6 * S), 'HOTEL', font=f2, fill=(255, 214, 110))

    # --- árboles y carros
    for (x, y, r) in arboles:
        arbol(d, x * S, y * S, r * S)
    carros = [(150, 330, (176, 40, 40), 'h'), (640, 360, (40, 80, 150), 'h'), (1180, 810, (220, 210, 190), 'h'),
              (1450, 840, (60, 120, 60), 'h'), (413, 560, (200, 160, 40), 'v'), (943, 140, (150, 40, 120), 'v'),
              (977, 1000, (40, 80, 150), 'v'), (300, 812, (90, 90, 96), 'h')]
    for (x, y, col, o) in carros:
        x, y = x * S, y * S
        if o == 'v':
            d.rounded_rectangle((x, y, x + 26 * S, y + 50 * S), 6 * S, fill=col, outline=TINTA, width=S)
            d.rectangle((x + 5 * S, y + 10 * S, x + 21 * S, y + 20 * S), fill=(40, 46, 56))
        else:
            d.rounded_rectangle((x, y, x + 50 * S, y + 26 * S), 6 * S, fill=col, outline=TINTA, width=S)
            d.rectangle((x + 30 * S, y + 5 * S, x + 40 * S, y + 21 * S), fill=(40, 46, 56))

    # --- tubería (la misma del mapa del Reino), a un lado del hotel, en el pasto
    tubo = Image.open(TUBO).convert('RGBA')
    k = W / 3300  # misma escala que en el mapa del Reino
    tubo = tubo.resize((round(tubo.width * k), round(tubo.height * k)), Image.LANCZOS)
    tx, ty = 1400 * S, 1020 * S
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    som = Image.new('RGBA', tubo.size, (20, 16, 8, 0))
    som.putalpha(tubo.getchannel('A').point(lambda v: v * 130 // 255))
    capa.alpha_composite(som, (tx + 10 * S, ty))
    img.alpha_composite(capa.filter(ImageFilter.GaussianBlur(6 * S)))
    img.alpha_composite(tubo, (tx, ty))
    d = ImageDraw.Draw(img)

    # --- rosa de los vientos
    rosa_vientos(d, 1460 * S, 140 * S, 105 * S)

    # grano de pintura sobre todo el mapa
    grano = ruido(W, H, ((2, 0.5), (6, 0.3), (24, 0.2)))
    arr = np.asarray(img).astype('float32')
    arr[..., :3] *= (1 + grano[..., None] * 0.07)
    img = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'), 'RGBA')

    # viñeta suave
    vin = Image.new('L', (W, H), 0)
    ImageDraw.Draw(vin).ellipse((-W * 0.2, -H * 0.2, W * 1.2, H * 1.2), fill=255)
    vin = vin.filter(ImageFilter.GaussianBlur(120 * S))
    oscuro = Image.new('RGBA', (W, H), (10, 12, 14, 255))
    img = Image.composite(img, oscuro, vin.point(lambda v: 160 + v * 95 // 255))

    final = img.convert('RGB').resize((2400, 1800), Image.LANCZOS)
    for w, q in [(2400, 78), (1600, 80), (960, 78)]:
        final.resize((w, w * 3 // 4), Image.LANCZOS).save(salida / f'mapa-mundo-real-{w}.webp', quality=q, method=6)
    if len(sys.argv) > 2:
        final.resize((1000, 750), Image.LANCZOS).save(sys.argv[2])


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
