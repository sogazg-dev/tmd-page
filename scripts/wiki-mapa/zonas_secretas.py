"""Tapa (desenfoca) las zonas secretas del mapa del Reino Champiñón.

Uso (desde la raíz del proyecto):
  python3 scripts/wiki-mapa/zonas_secretas.py <mapa original.png> src/assets/images/wiki/mapa/mapa-reino

Genera mapa-reino-1600.webp y mapa-reino-960.webp con las zonas ya borrosas
dentro de la imagen (pixeladas y desenfocadas: no se pueden recuperar).

IMPORTANTE: no guardes el mapa original dentro del proyecto (se sube a
GitHub y ahí sí se verían los lugares secretos).
Para revelar un lugar, quítalo de ZONAS y vuelve a correr el script.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
# zonas secretas (centro y radios en pixeles de la imagen original de 3300 x 2475)
ZONAS = [(362, 304, 230, 230), (1650, 2040, 310, 250), (2675, 2010, 350, 270)]
for (cx, cy, rx, ry) in ZONAS:
    m = 90
    box = (cx - rx - m, cy - ry - m, cx + rx + m, cy + ry + m)
    reg = im.crop(box)
    w, h = reg.size
    p = reg.resize((max(1, w // 30), max(1, h // 30)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    p = p.filter(ImageFilter.GaussianBlur(28))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).ellipse((m, m, m + 2 * rx, m + 2 * ry), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(30))
    reg.paste(p, (0, 0), mask)
    im.paste(reg, box[:2])
for w, q in [(2400, 78), (1600, 80), (960, 78)]:
    im.resize((w, w * 3 // 4), Image.LANCZOS).save(f'{out}-{w}.webp', quality=q, method=6)
