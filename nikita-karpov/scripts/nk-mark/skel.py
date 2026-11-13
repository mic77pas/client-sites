import numpy as np, json, sys
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi
src = sys.argv[1]
a = Image.open(src).convert("RGBA").split()[3].filter(ImageFilter.GaussianBlur(1.2))
K = 2
a = a.resize((a.width*K, a.height*K), Image.BICUBIC)
img = (np.array(a) > 128).astype(np.uint8)
img = ndi.binary_opening(img, iterations=2).astype(np.uint8)
def zs(im):
    im = im.copy(); changed = True
    while changed:
        changed = False
        for step in (0, 1):
            P = np.pad(im, 1)
            p2,p3,p4,p5,p6,p7,p8,p9 = (P[:-2,1:-1],P[:-2,2:],P[1:-1,2:],P[2:,2:],P[2:,1:-1],P[2:,:-2],P[1:-1,:-2],P[:-2,:-2])
            B = p2+p3+p4+p5+p6+p7+p8+p9
            seq = [p2,p3,p4,p5,p6,p7,p8,p9,p2]
            A = sum(((seq[i]==0)&(seq[i+1]==1)).astype(int) for i in range(8))
            if step == 0: c = (p2*p4*p6==0)&(p4*p6*p8==0)
            else: c = (p2*p4*p8==0)&(p2*p6*p8==0)
            m = (im==1)&(B>=2)&(B<=6)&(A==1)&c
            if m.any(): im[m] = 0; changed = True
    return im
sk = zs(img)
dist = ndi.distance_transform_edt(img)
nb = ndi.convolve(sk, np.ones((3,3)), mode="constant") - sk
ends = np.argwhere((sk==1)&(nb==1)); junc = np.argwhere((sk==1)&(nb>=3))
out = Image.new("RGB", (img.shape[1], img.shape[0]), "white")
out.paste(Image.fromarray((255 - img*60).astype(np.uint8)).convert("RGB"))
d = ImageDraw.Draw(out)
ys, xs = np.nonzero(sk)
for y, x in zip(ys, xs): out.putpixel((x, y), (0, 90, 255))
for y, x in ends: d.ellipse([x-5,y-5,x+5,y+5], outline=(220,0,0), width=2); d.text((x+7,y-6), f"{x//K},{y//K}", fill=(200,0,0))
for y, x in junc: d.ellipse([x-4,y-4,x+4,y+4], outline=(0,150,0), width=2)
# grid every 50 units
for g in range(0, 480, 50): d.line([(g*K,0),(g*K,8)], fill=(0,0,0)); d.text((g*K+2,10), str(g), fill=(0,0,0))
for g in range(0, 445, 50): d.line([(0,g*K),(8,g*K)], fill=(0,0,0)); d.text((10,g*K+2), str(g), fill=(0,0,0))
out.save("skel.png")
np.save("skel.npy", sk); np.save("dist.npy", dist)
print("ends", [(int(x)//K, int(y)//K) for y, x in ends])
print("max half-width (1x units):", round(dist.max()/K, 1))
