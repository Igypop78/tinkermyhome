# TinkerMyHome

Zdroj webu [tinkermyhome.com](https://tinkermyhome.com) – Home Assistant, fotovoltika, ESP32 a AI z reálneho domu. SK / EN.

```
node build.mjs        # zostaví web do dist/
node build.mjs --check
```

Statický generátor bez závislostí. Nasadzuje Cloudflare Workers pri pushi na `main` (build `node build.mjs`, deploy `npx wrangler deploy`, súbory z `dist`). Pokyny k obsahu sú v [CLAUDE.md](CLAUDE.md).
