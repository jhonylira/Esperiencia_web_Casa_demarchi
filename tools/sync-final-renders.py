"""Importa apenas renders finais novos/alterados, preservando originais e registrando a origem."""
from pathlib import Path
from PIL import Image
import json,re,time
root=Path(__file__).resolve().parents[1]
out=root/'dist'/'assets'
source=Path(r'D:\OneDrive - Rasterizze\RASTERIZZE - WORKSPACE\01_PROJETOS\RA26-003-RICARDO-E-JULIANA\02 - ESTUDO PRELIMINAR\IMAGENS-SUPERIOR-ETAPA2\RENDERS-REALISTAS-DIA-2026-10-26')
manifest=out/'render-versions.json'
data=json.loads(manifest.read_text(encoding='utf8')) if manifest.exists() else {'revision':0,'scenes':{}}
changed=[]
if source.exists():
    mapping={i:f'Scene {i} - realista dia.png' for i in range(1,31)}
    mapping[31]='Scene 13_1 - realista dia.png'
    for n in [15,22,28]:
        alt=f'Scene {n} - ArchViz final - realista dia.png'
        if (source/alt).exists():mapping[n]=alt
    mapping.update({41:'Scene 31_1 - ArchViz final v2 - realista dia.png',201:'CLOSET-LIVIA - realista dia.png',202:'Closet rosa com vidro bronze e roupas.png',301:'Scene 34 - realista dia.png',302:'Scene 35 - realista dia.png'})
    for n,filename in mapping.items():
        if data['scenes'].get(str(n),{}).get('locked'):continue
        p=source/filename
        if not p.exists():continue
        st=p.stat();stamp=f'{st.st_size}-{st.st_mtime_ns}'
        if data['scenes'].get(str(n),{}).get('stamp')==stamp:continue
        try:
            im=Image.open(p).convert('RGB');im.thumbnail((1920,1440))
            tmp=out/f'scene-{n:02}.new.webp';im.save(tmp,'WEBP',quality=88,method=5);tmp.replace(out/f'scene-{n:02}.webp')
            thumb=im.copy();thumb.thumbnail((480,360));tmp=out/f'thumb-{n:02}.new.webp';thumb.save(tmp,'WEBP',quality=80,method=4);tmp.replace(out/f'thumb-{n:02}.webp')
            data['scenes'][str(n)]={'stamp':stamp,'source':str(p),'final':True,'updated':time.strftime('%Y-%m-%d %H:%M:%S')};changed.append(n)
        except (OSError,ValueError) as e:print(f'Cena {n}: aguardando arquivo completo ({e})',flush=True)
if changed:
    data['revision']=int(time.time());tmp=manifest.with_suffix('.tmp');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8');tmp.replace(manifest)
print('Cenas finais atualizadas: '+str(changed),flush=True)
