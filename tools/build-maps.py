"""Build the real-outline maps for geography (geography-l2/js/mapdata.js) from Natural Earth (public domain).

Usage: python3 tools/build-maps.py <folder with Natural Earth GeoJSON>
Needs: pip install shapely
Data (from github.com/nvkelso/natural-earth-vector, folder geojson/):
  ne_50m_admin_0_countries.geojson, ne_10m_rivers_lake_centerlines.geojson,
  ne_50m_geography_regions_polys.geojson, ne_50m_lakes.geojson
Each map uses an equirectangular projection with a standard parallel near its centre,
so shapes are true at that latitude. Coordinates are rounded to 0.1 px.
"""
import json, math, sys, os
from shapely.geometry import shape, box, mapping
from shapely.ops import unary_union

src = sys.argv[1]
load = lambda f: json.load(open(os.path.join(src, f)))
countries = load('ne_50m_admin_0_countries.geojson')['features']
rivers = load('ne_10m_rivers_lake_centerlines.geojson')['features']
regions = load('ne_50m_geography_regions_polys.geojson')['features']
lakes = load('ne_50m_lakes.geojson')['features']


def proj(m):
    kx = m['w'] / (m['lon1'] - m['lon0'])
    ky = kx / math.cos(math.radians(m['latc']))
    m['kx'], m['ky'] = kx, ky
    m['h'] = round((m['lat1'] - m['lat0']) * ky, 1)
    return lambda lon, lat: (round((lon - m['lon0']) * kx, 1), round((m['lat1'] - lat) * ky, 1))


def path(geom, P, closed=True):
    out = []
    def ring(coords):
        pts = [P(x, y) for x, y in coords]
        s = 'M' + ' '.join(f'{x:g} {y:g}' for x, y in pts[:1])
        prev = pts[0]
        for p in pts[1:]:
            if p != prev:
                s += f'L{p[0]:g} {p[1]:g}'
            prev = p
        return s + ('Z' if closed else '')
    g = mapping(geom)
    t = g['type']
    if t == 'Polygon':
        for r in g['coordinates']: out.append(ring(r))
    elif t == 'MultiPolygon':
        for poly in g['coordinates']:
            for r in poly: out.append(ring(r))
    elif t == 'LineString':
        out.append(ring(g['coordinates']))
    elif t == 'MultiLineString':
        for l in g['coordinates']: out.append(ring(l))
    elif t == 'GeometryCollection':
        for gg in geom.geoms: out.append(path(gg, P, closed))
    return ''.join(out)


def clip(geom, m, tol):
    b = box(m['lon0'] - 0.5, m['lat0'] - 0.5, m['lon1'] + 0.5, m['lat1'] + 0.5)
    g = geom.intersection(b)
    return g.simplify(tol, preserve_topology=True) if not g.is_empty else g


def cgeom(names):
    return unary_union([shape(f['geometry']) for f in countries if f['properties']['ADMIN'] in names or f['properties']['NAME'] in names])


def region(name):
    return unary_union([shape(f['geometry']) for f in regions if (f['properties'].get('name') or f['properties'].get('NAME') or '').upper() == name])


def river(names, m, tol):
    gs = [shape(f['geometry']) for f in rivers if (f['properties'].get('name') or '') in names]
    return clip(unary_union(gs), m, tol) if gs else None


def build(m, extra):
    P = proj(m)
    tol = m['tol']
    land = clip(unary_union([shape(f['geometry']) for f in countries]), m, tol)
    if m.get('minarea'):  # drop small islands at world scale
        from shapely.geometry import MultiPolygon
        land = MultiPolygon([g for g in getattr(land, 'geoms', [land]) if g.area >= m['minarea']])
    out = {k: m[k] for k in ('w', 'h', 'lon0', 'lon1', 'lat0', 'lat1', 'kx', 'ky')}
    out['kx'], out['ky'] = round(out['kx'], 4), round(out['ky'], 4)
    out['land'] = path(land, P)
    # borders between countries: each country outline (shared edges drawn twice; fine at this size)
    bs = []
    for f in countries:
        g = shape(f['geometry'])
        if g.intersects(box(m['lon0'], m['lat0'], m['lon1'], m['lat1'])):
            bs.append(path(clip(g.boundary, m, tol), P, closed=False))
    out['borders'] = ''.join(bs)
    for k, fn in extra.items():
        g = fn(m, tol)
        if g is not None and not g.is_empty:
            out[k] = path(g, P, closed=k not in ('rivers', 'main', 'mekong'))
    return out


AM = dict(w=420, lon0=-82, lon1=-34, lat0=-22, lat1=13, latc=0, tol=0.08)
LA = dict(w=380, lon0=99.3, lon1=110, lat0=13, lat1=23.6, latc=18, tol=0.02)
WO = dict(w=440, lon0=-170, lon1=180, lat0=-56, lat1=78, latc=0, tol=1.0, minarea=4)

data = {
    'amazon': build(AM, {
        'basin': lambda m, t: clip(region('AMAZON BASIN'), m, t),
        'andes': lambda m, t: clip(region('ANDES'), m, t),
        'brazil': lambda m, t: clip(cgeom(['Brazil']), m, t),
        'main': lambda m, t: river(['Amazonas'], m, t / 2),
        'rivers': lambda m, t: river(['Negro', 'Madeira', 'Japurá', 'Juruá', 'Ucayali', 'Marañón', 'Tapajós', 'Xingu', 'Juruena'], m, t / 2),
    }),
    'laos': build(LA, {
        'laos': lambda m, t: clip(cgeom(['Laos', 'Lao PDR']), m, t),
        'annamite': lambda m, t: clip(region('CHAÎNE ANNAMITIQUE'), m, t),
        'mekong': lambda m, t: river(['Mekong', 'Lancang'], m, t),
        'lakes': lambda m, t: clip(unary_union([shape(f['geometry']) for f in lakes]), m, t),
    }),
    'world': build(WO, {
        'laos': lambda m, t: clip(cgeom(['Laos', 'Lao PDR']), m, 0.05),
        'usa': lambda m, t: clip(cgeom(['United States of America']), m, t / 2),
        'nz': lambda m, t: clip(cgeom(['New Zealand']), m, t / 2),
    }),
}
data['world']['borders'] = ''  # not needed at world scale

js = ('/* Real map outlines for geography, generated by tools/build-maps.py from Natural Earth (public domain).\n'
      '   Do not edit by hand. Each map: size (w, h), extent (lon0..lon1, lat0..lat1), scale (kx, ky px per degree), SVG paths. */\n'
      'NP.geoData = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
dst = os.path.join(os.path.dirname(__file__), '..', 'geography-l2', 'js', 'mapdata.js')
open(dst, 'w').write(js)
print('wrote', dst, len(js), 'bytes;', {k: {kk: len(v) for kk, v in d.items() if isinstance(v, str)} for k, d in data.items()})
