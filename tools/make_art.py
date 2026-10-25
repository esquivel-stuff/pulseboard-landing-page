# Draws the three mood images for the Pulseboard template as SVG (procedural, no photos, no AI).
import random, math
W,H=1536,1024
GRAIN='''<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" stitchTiles="stitch"/>
<feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .09 0"/></filter>
<filter id="blur40" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="blur90" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="90"/></filter>
<filter id="blur8" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter>'''
def svg(body,defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{GRAIN}{defs}</defs>{body}<rect width="{W}" height="{H}" filter="url(#grain)"/></svg>'

# 1. Doorway: dark hall, glowing door, small figure
dx,dy,dw,dh=650,360,200,450
floor=dy+dh
defs='''<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0605"/><stop offset="1" stop-color="#1a0c08"/></linearGradient>
<radialGradient id="halo" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#ff5a1f" stop-opacity=".55"/><stop offset=".5" stop-color="#7a2410" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="door" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6a2a"/><stop offset="1" stop-color="#e2461a"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2826"/><stop offset="1" stop-color="#0b0a0a"/></linearGradient>
<linearGradient id="spill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb08a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb08a" stop-opacity="0"/></linearGradient>'''
b=f'<rect width="{W}" height="{H}" fill="url(#wall)"/>'
b+=f'<ellipse cx="{dx+dw/2}" cy="{dy+dh*0.55}" rx="620" ry="520" fill="url(#halo)"/>'
b+=f'<rect x="0" y="{floor}" width="{W}" height="{H-floor}" fill="url(#floor)"/>'
b+=f'<polygon points="{dx},{floor} {dx+dw},{floor} {dx+dw+260},{H} {dx-340},{H}" fill="url(#spill)" filter="url(#blur8)"/>'
b+=f'<rect x="{dx-30}" y="{dy-30}" width="{dw+60}" height="{dh+30}" fill="#ff5a1f" opacity=".5" filter="url(#blur40)"/>'
b+=f'<rect x="{dx}" y="{dy}" width="{dw}" height="{dh}" fill="url(#door)"/>'
b+=f'<rect x="{dx+120}" y="{dy+190}" width="{dw-120}" height="{dh-190}" fill="#ff8c4a"/>'
fx,fy=dx+60,floor
b+=f'<g fill="#0c0807"><circle cx="{fx}" cy="{fy-62}" r="7"/><path d="M{fx-12},{fy-52} Q{fx},{fy-58} {fx+12},{fy-52} L{fx+14},{fy-20} L{fx+8},{fy-20} L{fx+7},{fy} L{fx+2},{fy} L{fx},{fy-18} L{fx-2},{fy} L{fx-7},{fy} L{fx-8},{fy-20} L{fx-14},{fy-20} Z"/></g>'
b+=f'<ellipse cx="{fx-40}" cy="{fy+6}" rx="60" ry="5" fill="#000" opacity=".5" filter="url(#blur8)"/>'
open('doorway.svg','w').write(svg(b,defs))

# 2. Ridges under a low sun
random.seed(3)
def ridge(base,amp,rough,step=8):
    pts=[];y=base
    for x in range(0,W+step,step):
        y+=random.uniform(-rough,rough); y=base+(y-base)*0.96
        pts.append((x,y+amp*math.sin(x/170+base)))
    return 'M0,'+f'{H} '+' '.join(f'L{x},{y:.1f}' for x,y in pts)+f' L{W},{H} Z'
defs='''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120605"/><stop offset=".55" stop-color="#5a160b"/><stop offset=".75" stop-color="#c2401a"/></linearGradient>'''
b=f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
b+='<circle cx="980" cy="520" r="260" fill="#ff7a2e" opacity=".45" filter="url(#blur90)"/><circle cx="980" cy="520" r="110" fill="#ffb26b"/>'
cols=['#8a2a12','#5e1b0c','#3a1008','#200805','#0c0403']
for i,c in enumerate(cols):
    b+=f'<path d="{ridge(560+i*90,22+i*12,2.2+i*1.2,14)}" fill="{c}"/>'
open('ridges.svg','w').write(svg(b,defs))

# 3. Black towers against a red sky
random.seed(11)
defs='''<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0504"/><stop offset=".6" stop-color="#8f1f0e"/><stop offset=".82" stop-color="#e0552a"/><stop offset="1" stop-color="#2a0a06"/></linearGradient>
<linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0552a" stop-opacity="0"/><stop offset="1" stop-color="#e0552a" stop-opacity=".35"/></linearGradient>'''
b=f'<rect width="{W}" height="{H}" fill="url(#sky2)"/>'
hz=820
for layer,(col,n,hmin,hmax) in enumerate([('#3a0c07',14,120,360),('#160504',10,200,560),('#050101',6,300,760)]):
    for _ in range(n):
        w=random.randint(40,120)+layer*30; x=random.randint(-60,W); h=random.randint(hmin,hmax)
        b+=f'<rect x="{x}" y="{hz-h}" width="{w}" height="{h+300}" fill="{col}"/>'
    b+=f'<rect x="0" y="{hz-260}" width="{W}" height="260" fill="url(#fog)"/>'
b+=f'<rect x="0" y="{hz}" width="{W}" height="{H-hz}" fill="#050101"/>'
open('towers.svg','w').write(svg(b,defs))
print('ok')
