# TinkerMyHome

Zdroj webu [tinkermyhome.com](https://tinkermyhome.com) – Home Assistant, fotovoltika, ESP32 a AI z reálneho domu. SK / EN.

```
node build.mjs        # zostaví web do dist/
node build.mjs --check
```

Statický generátor bez závislostí. Nasadzuje Cloudflare Pages pri pushi na `main` (build `node build.mjs`, výstup `dist`). Pokyny k obsahu sú v [CLAUDE.md](CLAUDE.md).
