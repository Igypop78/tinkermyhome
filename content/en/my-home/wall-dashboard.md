---
id: dashboards
cover: /img/clanky/titulky/dashboard.jpg
title: A wall dashboard at home – why I have one, even though a smart home should run itself
description: A wall dashboard for Home Assistant – what it's for, who uses it in our home, tablet or display, hiding cables, magnetic mounting, an LED frame from an addressable strip on an ESP32 and a design made with AI. Including the ESPHome code.
section: home
also: diy
level: 2
date: 2026-11-27
updated: 2026-11-27
slug: wall-dashboard
tldr: A wall dashboard isn't a remote for everything, it's **a window into the house** – I see what the solar panels, battery, heating and spot trading are doing. I have a **10" Waveshare touch display for ~€80**, a kiosk on Proxmox, **magnetic mounting** and around it an **LED frame from an addressable strip driven by an ESP32** that shows the state of the house from across the room. The ESPHome code is at the end.
---

A wall dashboard in a smart home is supposedly pointless. A good smart home should run itself and people shouldn't have to step in – if you have to tap something on a tablet, the automation failed. At least that's what some people say.

I partly agree. Heating, alerts or the gate should take care of themselves, and most things in our home work that way (I wrote about it in [7 automations that really work in our home](/en/my-home/best-automations/)).

But I see it differently: **I like to know what is happening in the house and when.** Automation makes things happen. The dashboard shows me they really are happening. And when something breaks, I see it with a glance at the wall, not when the house is already cold.

::youtube NszpFk6uB3c The whole dashboard in the video (in Slovak) – who uses it in our home, the magnets, the LED frame that lights up for every new subscriber, and the design made with AI.

![Wall dashboard with the LED frame in the evening](/img/clanky/dashboard-stena-vecer.jpg)

## What a wall dashboard is good for

- **Information** – at a glance I see solar production, house consumption, grid, battery, gas, water, hot water and room temperatures.
- **Control** – only what automation can't guess: blinds in the morning, room temperature, a light someone needs right now.
- **Security** – arming the carport, the entrance camera with one tap, an alarm for smoke or water.
- **Joy** – yes, that too. It's nice to look at the wall and see the solar panels at full power, the heating off, or that someone has just subscribed on YouTube. 🙂

## Who uses it in our home

**I** use it mainly for an overview – energy interests me most. How the solar panels are doing, whether the battery is selling to the grid, how [spot trading](/en/energy/battery-trading-on-spot/) is going, whether the heating is running. The main screen shows energy flows; details (including spot prices) are on a second screen after tapping energy. And whether I'm exporting or importing is clear from the LED frame alone.

**Katka** uses it completely differently. She sets the [temperature in the rooms](/en/my-home/smart-heating/) and switches the lights in the boys' rooms on and off when she calls them for dinner.

So the same dashboard has to suit a tech person and a regular user. That's why my display has big tiles, little text and controls for just a few things.

## What to show it on

| Device | Pros | Watch out for |
|---|---|---|
| **Tablet** | cheap, touch, all in one | battery on non-stop power, performance |
| **Touch display + computer** | no battery, the display can be thin | you need something to show the page (mini PC, Raspberry Pi) |
| **TV** | big screen, visible from afar | remote control only, more for an occasional look |

### Tablet – what to watch out for

- **Battery and non-stop power.** A tablet that sits on a charger for years will sooner or later ruin its battery – it can even swell. Charging through a smart plug or relay helps (e.g. only between 20 and 80 %). Some tablets can limit charging by themselves.
- **Performance.** A dashboard is a web page, and with many cards, animations and cameras it gets demanding. An old cheap tablet will stutter and lag. Better fewer cards that run smoothly.
- **Screen always on.** For permanent use you need a kiosk app (e.g. Fully Kiosk Browser) or at least sleep turned off.

## My wall display

:::me How I have it
- **Display:** 10.1" Waveshare touch display (1280 × 800, IPS, HDMI) for ~€80. No tablet.
- **Computer:** the display is connected through the wall by an **HDMI** cable (picture) and **USB** (touch and power) to a mini PC running Proxmox. Home Assistant runs there, and next to it a **kiosk VM** with Chromium – its only job is to show the dashboard full screen.
- **Frame:** made of a black aluminium LED profile, corners joined with aluminium brackets. Inside is an addressable LED strip (42 LEDs) shining onto the wall. It's driven by an **ESP32-C6** behind the wall.
- **Mounting:** neodymium magnets are screwed into the wall and a metal strip is glued to the back of the display. I just put the display into the frame.
:::

Pros: no battery to swell, and the mini PC easily handles a demanding page. Cons: you need a computer (I have one anyway) and cables through the wall.

![The current version of my dashboard](/img/clanky/dashboard-obrazovka.png)

## How to hide power and cables

A cable hanging from the wall ruins even the nicest dashboard. Options:

1. **Next to a switch.** The ideal spot – the box behind a switch has 230 V, so a small power supply fits there and the cable comes out right behind the display.
2. **Through the wall.** If there's room for tech behind the wall (like in my case), drill a hole and run the cables straight to the back.
3. **Sacrifice an unused switch.** Replace a switch that does nothing with a blank plate and use the box behind it for the power supply and cables.
4. **Keep the cable.** If it doesn't bother you, the display can stand on a cabinet. It's up to your creativity.

:::warn Careful with 230 V
Work in a 230 V box is a job for an electrician. The power supply must be meant for a wall box (or at least well insulated) and must not overheat.
:::

![The frame without the display – magnets, HDMI and USB through the wall, LED strip connector](/img/clanky/dashboard-ramik-zozadu.jpg)

## How to mount it on the wall

- **A bought holder** – wall holders and frames exist for tablets.
- **3D printing** – for most tablets and displays you'll find a ready-made holder model.
- **Magnets** – my solution. Four neodymium pot magnets are screwed into wall plugs. On the back of the display I glued pieces of metal magnetic strip opposite the magnets. The display comes off with one move (e.g. for the cables) and no screws are visible. The black frame only covers the edges and holds the LED strip.

![A neodymium magnet in the corner of the frame](/img/clanky/dashboard-magnet.jpg)

![The back of the Waveshare display with pieces of metal strip](/img/clanky/dashboard-displej-zozadu.jpg)

:::warn Neodymium magnets are strong
The magnets pull the display in hard – bring it closer slowly so you don't damage the glass or your fingers. And keep them away from children.
:::

## How to make a backlight from an addressable LED strip

This turns an ordinary display into something more. In an addressable LED strip every LED can have a different colour. So the frame shows the state of the house even when you can't see the display – from the kitchen or the sofa.

My frame has 42 LEDs split into sections:

| LEDs | Position | What it shows |
|---|---|---|
| 0–4 | bottom right | **Grid** – red import, green export; a "comet" shows the direction of flow (off below 200 W) |
| 5–13 | right side | **Battery** – height = state of charge, green charging (up), red discharging (down), blue idle |
| 14–27 | top | **Solar production** – yellow from the centre outwards according to power |
| 28–36 | left side | **Gas** – flickering flame, height = boiler power |
| 37–41 | bottom left | **Carport alarm** – green armed, red disarmed |

On top of that:

- **Motion at the entrance** – white light runs around the whole frame.
- **Alarm** (smoke, water, siren) overrides everything – the whole frame flashes red.
- **At night** the frame stays on, just dimmer (brightness follows the sun's elevation).
- **New YouTube subscriber** – a red-white wave with sparks for 8 seconds.

In the opening photo you can see: gas burning on the left (orange), the battery discharging on the right (red), export to the grid bottom right and the carport armed bottom left (both green).

:::tip Make our wall flash
If you [subscribe on YouTube](https://www.youtube.com/@TinkerMyHome?sub_confirmation=1) now, the LED frame in our home will light up. Really. Try it. 🎉
:::

## How to make your own dashboard design

Design is no longer a limit. You have two ways:

1. **The classic way in Home Assistant** – cards, sections, possibly custom cards from HACS (e.g. my [Igy Cards](https://github.com/Igypop78/igy-cards)). You can build a nice dashboard this way, but it's laborious – especially fitting it onto one fixed screen without scrolling.
2. **With the help of AI** – your own web page that takes data from Home Assistant. You describe what you want to see and how it should look, AI writes the page and you fine-tune it. My current dashboard was made this way – the whole process is in the video at the top of this article.

### My dashboard as a template

My dashboard is a single HTML file (`wall.html`) – no installation, no libraries. Have a look at the [live demo](/ukazky/wall.html): it runs with made-up numbers (DEMO shows at the top centre) and you can tap around – rooms, lights, energy, weather, windows. It looks best full screen in landscape (it's built for 1280 × 800) and the texts are in Slovak. The full code is on [GitHub](https://github.com/Igypop78/tinkermyhome/blob/main/static/ukazky/wall.html). I only removed the camera's address on my home network and a few names from the demo data.

How to use it at home:

1. Save the file to Home Assistant as `/config/www/wall.html` – it opens at `/local/wall.html`.
2. At the top of the script, in the `E` block, replace the entities with your own (solar, grid, battery, rooms, lights, alarms…) and set the full scale of the bars in `MAXV`.
3. Show it as a **Webpage** card in an HA dashboard (it takes data from the logged-in HA, no token needed), or directly in the kiosk browser with a token at the end of the address: `/local/wall.html#token=…`.
4. After every change, bump `VERSION` – the display reloads by itself within a minute. Holding a finger on the clock opens connection diagnostics.

:::warn The token doesn't belong in the file
Files in `/config/www` are reachable **without logging in**. Never write the token into `wall.html` – only into the kiosk's address. Create a separate non-admin user in HA for the token.
:::

My advice: first write down on paper **what you want to see without tapping** and **what the rest of the family needs to control**. Only then deal with colours and icons.

## Code for the LED frame (ESPHome)

The frame runs on an ESP32-C6 with [ESPHome](https://esphome.io) (what an ESP32 and ESPHome are, I explain in [ESP32 – a chip for a few euros](/en/diy/esp32-my-projects/)). Note: this is not the WLED project – the effect is written directly in ESPHome as an `addressable_lambda` that calculates the colour of all 42 LEDs every 33 ms. Data (solar, grid, battery, gas, alarms) comes straight from Home Assistant.

In Home Assistant you get:

- switch **LED frame logic** – off = the frame is completely dark (even on alarm),
- switch **LED frame simulation** – made-up values, all sections slowly change (for tuning and filming),
- sliders **LED brightness day** and **LED brightness night**,
- buttons **LED test motion**, **LED test alarm**, **LED subscriber celebration**,
- actions `esphome.led_frame_led_celebrate`, `esphome.led_frame_led_motion` and `esphome.led_frame_led_alarm_test` for automations.

Replace the entities in the `sensor:` and `binary_sensor:` sections with your own (mine have Slovak names).

```yaml led-frame.yaml
substitutions:
  name: led-frame
  friendly_name: LED frame

# ---------------------------------------------------------------------------
# LED frame around the display – 42 LEDs, index 0–41 counter-clockwise:
#   0–4   bottom right (0 at centre, 4 in corner) → GRID (import runs towards the battery, export away from it; off between −200 and +200 W)
#   5–13  right side   (5 bottom, 13 top)         → BATTERY (height = SOC, 1 LED ≈ 11 %)
#   14–27 top          (14 right, 27 left)        → SOLAR PRODUCTION (from the centre outwards)
#   28–36 left side    (28 top, 36 bottom)        → GAS (flame, height = power)
#   37–41 bottom left  (37 in corner, 41 at centre) → CARPORT ALARM
#   (carport: green = armed, red = disarmed)
# Events: motion at the entrance = white light runs around the frame, celebration = red-white wave (8 s)
# Alarm (smoke, water, siren) overrides everything: the whole frame flashes red.
# At night the frame stays on, just dimmer (based on sun elevation).
# ---------------------------------------------------------------------------

esphome:
  name: ${name}
  friendly_name: ${friendly_name}
  comment: LED frame around the wall display (ESP32-C6)
  min_version: 2024.8.0
  on_boot:
    priority: -100
    then:
      - light.turn_on:
          id: led_frame
          effect: "Panel"

esp32:
  board: esp32-c6-devkitc-1
  variant: esp32c6
  framework:
    type: esp-idf

logger:

api:
  # Called from HA: action "ESPHome: led_frame_led_celebrate" (e.g. on a new subscriber)
  actions:
    - action: led_celebrate
      then:
        - lambda: 'id(ev_type) = 2; id(ev_start) = millis();'
    - action: led_motion
      then:
        - lambda: 'id(ev_type) = 1; id(ev_start) = millis();'
    - action: led_alarm_test
      then:
        - lambda: 'id(test_alarm_until) = millis() + 5000;'

ota:
  - platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  power_save_mode: none

globals:
  # event on the LED frame: 0 = none, 1 = motion, 2 = celebration
  - id: ev_type
    type: int
    restore_value: no
    initial_value: '0'
  - id: ev_start
    type: uint32_t
    restore_value: no
    initial_value: '0'
  # test alarm runs until this time (millis)
  - id: test_alarm_until
    type: uint32_t
    restore_value: no
    initial_value: '0'

light:
  - platform: esp32_rmt_led_strip
    chipset: WS2812
    rgb_order: GRB
    pin: GPIO3
    num_leds: 42
    name: "LED frame"
    id: led_frame
    restore_mode: ALWAYS_ON
    default_transition_length: 0s
    effects:
      - addressable_lambda:
          name: "Panel"
          update_interval: 33ms
          lambda: |-
            const int N = 42;
            const uint32_t now = millis();
            const float t = now / 1000.0f;
            auto c01 = [](float x) { return x < 0.0f ? 0.0f : (x > 1.0f ? 1.0f : x); };
            auto val = [](float v) { return isnan(v) ? 0.0f : v; };

            static float R[N], G[N], B[N];
            for (int i = 0; i < N; i++) { R[i] = 0; G[i] = 0; B[i] = 0; }
            auto add = [&](int i, float r, float g, float b, float a) {
              if (i < 0 || i >= N || a <= 0) return;
              R[i] += r * a; G[i] += g * a; B[i] += b * a;
            };

            // ---------- main switch from HA: "LED frame logic" ----------
            if (!id(led_logic).state) {
              for (int i = 0; i < N; i++) it[i] = Color(0, 0, 0);
              return;
            }

            // ---------- brightness: between "LED brightness night" and "day" based on sun elevation ----------
            float jd = c01(val(id(led_jas_den).state) / 100.0f), jn = c01(val(id(led_jas_noc).state) / 100.0f);
            float el = id(ha_sun_el).state;
            float master = isnan(el) ? jd : jn + (jd - jn) * c01((el + 6.0f) / 10.0f);

            // ---------- inputs: from HA, or made up when "LED frame simulation" is on ----------
            bool sim = id(led_sim).state;
            float in_grid = sim ? 6000.0f * sinf(t * 0.21f) : val(id(ha_grid).state);
            float in_bat  = sim ? 5000.0f * sinf(t * 0.13f + 1.0f) : val(id(ha_bat).state);
            float in_soc  = sim ? 50.0f + 48.0f * sinf(t * 0.05f) : val(id(ha_soc).state);
            float in_pv   = sim ? 5000.0f + 5000.0f * sinf(t * 0.09f) : val(id(ha_pv).state);
            float in_gas  = sim ? fmaxf(0.0f, 28.0f * sinf(t * 0.11f + 2.0f)) : val(id(ha_gas).state);
            bool  in_sec  = sim ? (fmodf(t, 20.0f) < 10.0f) : id(ha_security).state;

            // ---------- alarm: smoke, water, siren (or test) → whole frame flashes red ----------
            bool alarm = id(ha_dym).state || id(ha_voda_kuchyna).state || id(ha_voda_kupelna).state || id(ha_sirena).state
                         || (int32_t)(id(test_alarm_until) - now) > 0;
            if (alarm) {
              float a = ((now / 250) % 2) ? 1.0f : 0.08f;
              for (int i = 0; i < N; i++) it[i] = Color((uint8_t)(255 * a * fmaxf(jd, 0.3f)), 0, 0);
              return;
            }

            // comet: sharp head + tail behind it, then a pause → direction is obvious
            // returns brightness for position x (0 = start of the path) on a path of length n
            const float CSPEED = 4.5f;                       // LEDs per second
            auto comet = [&](float x, int n) {
              float run = (n + 2.5f) / CSPEED, period = run / 0.75f;   // 25 % of the period is a pause
              float tt = fmodf(t, period);
              if (tt > run) return 0.0f;
              float pos = tt / run * (n + 2.5f) - 0.5f;
              float d = pos - x;                             // > 0 = LED is behind the head (tail)
              if (d < -0.6f) return 0.0f;
              if (d < 0) return 1.0f + d / 0.6f;
              return expf(-d / 1.1f);
            };

            float gp = in_grid, bp = in_bat;
            float soc = c01(in_soc / 100.0f);
            int nb = (int) ceilf(soc * 9.0f - 0.01f);      // each LED ≈ 11 %, 20 % = 2 LEDs
            if (nb < 1) nb = 1;
            bool gImp = gp > 200.0f, gExp = gp < -200.0f, bChg = bp > 50, bDis = bp < -50;
            float cg[5] = {0, 0, 0, 0, 0}, cb[9] = {0, 0, 0, 0, 0, 0, 0, 0, 0};
            // shared path battery ↔ grid:
            //   discharging to grid: battery top to bottom (13→5), then grid to the left (4→0)
            //   charging from grid:  grid to the right (0→4), then battery bottom to top (5→13)
            bool chain = (bDis && gExp) || (bChg && gImp);
            if (chain) {
              int L = nb + 5;
              for (int k = 0; k < L; k++) {
                float c = comet(k, L);
                if (bDis) { if (k < nb) cb[nb - 1 - k] = c; else cg[4 - (k - nb)] = c; }
                else      { if (k < 5) cg[k] = c;           else cb[k - 5] = c; }
              }
            } else {
              for (int p = 0; p < 5; p++)  cg[p] = comet(gImp ? p : 4 - p, 5);          // import to the right, export to the left
              for (int p = 0; p < nb; p++) cb[p] = comet(bChg ? p : nb - 1 - p, nb);    // charging upwards, discharging downwards
            }

            // ---------- GRID (0–4): red import (towards battery, right), green export (from battery, left) ----------
            if (gImp || gExp) {
              float f = c01(fabsf(gp) / 10000.0f);
              float r = gImp ? 255 : 0, g = gImp ? 35 : 220, b = gImp ? 25 : 90;
              float base = 0.35f + 0.35f * f;               // more power = brighter strip
              for (int p = 0; p < 5; p++) add(p, r, g, b, base + 0.45f * cg[p]);
            }

            // ---------- BATTERY (5–13): height = SOC; charging green (up), discharging red (down) ----------
            for (int p = 0; p < nb; p++) {
              if (bChg)      add(5 + p, 0, 220, 90, 0.5f + 0.45f * cb[p]);
              else if (bDis) add(5 + p, 255, 40, 30, 0.5f + 0.45f * cb[p]);
              else           add(5 + p, 80, 130, 255, 0.4f);   // battery idle: dim blue
            }

            // ---------- SOLAR (14–27): yellow from the centre outwards ----------
            float pv = in_pv;
            if (pv > 50) {
              float half = c01(pv / 10000.0f) * 7.0f;
              if (half < 0.6f) half = 0.6f;
              for (int i = 14; i <= 27; i++) {
                float d = fabsf(i - 20.5f);
                float fill = c01(half - d + 0.5f);
                if (fill <= 0) continue;
                float a = 0.75f + 0.25f * sinf(t * 1.2f + d * 0.7f);
                add(i, 255, 170, 15, a * fill);
              }
            }

            // ---------- GAS (28–36): flame from the bottom, height = power ----------
            static float fl[9];
            float gas = in_gas;
            float gh = gas > 0.05f ? c01(gas / 28.0f) * 9.0f : 0.0f;
            if (gas > 0.05f && gh < 1.0f) gh = 1.0f;
            for (int p = 0; p < 9; p++) {
              float fill = c01(gh - p);
              if (fill <= 0) { fl[p] = 0; continue; }
              float target = 0.5f + 0.5f * random_float();
              fl[p] += (target - fl[p]) * 0.25f;
              float k = p / 8.0f;                          // 0 = bottom (yellow-orange), 1 = top (red-orange)
              add(36 - p, 255, 150 - 110 * k, 10, fl[p] * fill);
            }

            // ---------- CARPORT ALARM (37–41) ----------
            for (int i = 37; i <= 41; i++) {
              if (in_sec) add(i, 0, 200, 70, 0.55f);        // armed: green
              else        add(i, 255, 30, 20, 0.5f);        // disarmed: red
            }

            // ---------- EVENTS ----------
            uint32_t ev = now - id(ev_start);
            if (id(ev_type) == 1) {                          // motion: white light runs around the frame (1.5 s)
              if (ev > 1500) id(ev_type) = 0;
              else {
                float head = ev / 1500.0f * (N + 6);
                for (int i = 0; i < N; i++) {
                  float d = head - i;
                  if (d >= 0 && d < 6) add(i, 255, 255, 255, 1.0f - d / 6.0f);
                }
              }
            } else if (id(ev_type) == 2) {                   // celebration: red-white wave + sparks (8 s)
              if (ev > 8000) id(ev_type) = 0;
              else {
                float e = ev / 1000.0f;
                float env = c01(e / 0.3f) * c01((8.0f - e) / 1.0f);
                for (int i = 0; i < N; i++) {
                  float ph = i / (float) N * 4.0f - e * 1.2f;
                  bool white = fmodf(ph + 100.0f, 1.0f) < 0.35f;
                  float r = 255, g = white ? 255 : 0, b = white ? 255 : 0;
                  if (random_float() < 0.05f) { r = 255; g = 255; b = 255; }
                  R[i] = R[i] * (1 - env) + r * env;
                  G[i] = G[i] * (1 - env) + g * env;
                  B[i] = B[i] * (1 - env) + b * env;
                }
              }
            }

            // ---------- output ----------
            for (int i = 0; i < N; i++) {
              float m = (id(ev_type) != 0) ? fmaxf(master, 0.6f * jd) : master;   // events are visible at night too
              it[i] = Color((uint8_t) fminf(255.0f, R[i] * m), (uint8_t) fminf(255.0f, G[i] * m), (uint8_t) fminf(255.0f, B[i] * m));
            }

# ---------------- Data from Home Assistant for the LED frame ----------------
sensor:
  - platform: homeassistant
    id: ha_pv
    entity_id: sensor.pv_power_inverter_keep          # W
    internal: true
  - platform: homeassistant
    id: ha_grid
    entity_id: sensor.em_main_power_keep              # W, + import, − export
    internal: true
  - platform: homeassistant
    id: ha_bat
    entity_id: sensor.smartshunt_vykon_bateria_smartshunt_pristresok   # W, + charging, − discharging
    internal: true
  - platform: homeassistant
    id: ha_soc
    entity_id: sensor.smartshunt_soc_bateria_smartshunt_pristresok     # %
    internal: true
  - platform: homeassistant
    id: ha_gas
    entity_id: sensor.gas_power_keep                  # kW
    internal: true
  - platform: homeassistant
    id: ha_sun_el
    entity_id: sun.sun
    attribute: elevation
    internal: true

binary_sensor:
  - platform: homeassistant
    id: ha_security
    entity_id: input_boolean.zabezpecenie
    internal: true
  - platform: homeassistant
    id: ha_motion
    entity_id: binary_sensor.zahrada_vchod_pohyb
    internal: true
    on_press:
      - lambda: |-
          if (id(ev_type) == 0) { id(ev_type) = 1; id(ev_start) = millis(); }
  - platform: homeassistant
    id: ha_dym
    entity_id: binary_sensor.kuchyna_dym
    internal: true
  - platform: homeassistant
    id: ha_voda_kuchyna
    entity_id: binary_sensor.kuchyna_zaplava
    internal: true
  - platform: homeassistant
    id: ha_voda_kupelna
    entity_id: binary_sensor.kupelna_hore_zaplava
    internal: true
  - platform: homeassistant
    id: ha_sirena
    entity_id: siren.pristresok_sirena_alarm
    internal: true

# ---------------- LED frame controls in HA ----------------
switch:
  - platform: template
    name: "LED frame logic"           # off = frame is completely dark (no alarm either)
    id: led_logic
    icon: mdi:led-strip-variant
    optimistic: true
    restore_mode: RESTORE_DEFAULT_ON
  - platform: template
    name: "LED frame simulation"      # on = made-up values, all sections slowly change
    id: led_sim
    icon: mdi:play-circle-outline
    optimistic: true
    restore_mode: ALWAYS_OFF

number:
  - platform: template
    name: "LED brightness day"
    id: led_jas_den
    icon: mdi:brightness-7
    optimistic: true
    restore_value: true
    initial_value: 100
    min_value: 0
    max_value: 100
    step: 5
    unit_of_measurement: "%"
    mode: slider
  - platform: template
    name: "LED brightness night"
    id: led_jas_noc
    icon: mdi:brightness-3
    optimistic: true
    restore_value: true
    initial_value: 25
    min_value: 0
    max_value: 100
    step: 5
    unit_of_measurement: "%"
    mode: slider

# Buttons in HA to try the effects
button:
  - platform: template
    name: "LED test motion"
    icon: mdi:motion-sensor
    on_press:
      - lambda: 'id(ev_type) = 1; id(ev_start) = millis();'
  - platform: template
    name: "LED test alarm"
    icon: mdi:alarm-light
    on_press:
      - lambda: 'id(test_alarm_until) = millis() + 5000;'
  - platform: template
    name: "LED subscriber celebration"
    icon: mdi:party-popper
    on_press:
      - lambda: 'id(ev_type) = 2; id(ev_start) = millis();'
```

:::info What I changed compared to my own version
I removed the room temperature measurement (the same ESP also reads temperatures over 1-Wire, but that doesn't belong in this guide), unused variables and leftovers from ESPHome Web. The light is called "LED frame" instead of "WLED" so nobody confuses it with the WLED project. `min_version` is 2024.8.0, because `api: actions:` only works from that version.
:::

### New subscriber celebration – automation in HA

The ESP just waits for the `led_celebrate` action. Home Assistant decides when to call it. I have the **YouTube** integration in HA, which provides a sensor with the channel's subscriber count. When the number goes up, the LED frame starts the celebration and I get a Pushover notification:

```yaml celebration-automation.yaml
alias: LED frame – new YouTube subscriber celebration
description: >-
  When the TinkerMyHome channel gets a new subscriber, the LED frame celebrates
  and a Pushover notification arrives.
triggers:
  - trigger: state
    entity_id: sensor.subscribers_tinkermyhome
    not_from:
      - unavailable
      - unknown
    not_to:
      - unavailable
      - unknown
conditions:
  - condition: template
    value_template: >
      {{ trigger.from_state.state | is_number and trigger.to_state.state |
      is_number
         and trigger.to_state.state | float > trigger.from_state.state | float }}
actions:
  - action: esphome.led_frame_led_celebrate
  - action: notify.pushover
    data:
      title: 🎉 New YouTube subscriber
      message: >-
        TinkerMyHome has {{ trigger.to_state.state | int }} subscribers (+{{
        (trigger.to_state.state | int) - (trigger.from_state.state | int) }}).
mode: single
```

`not_from` / `not_to` and the `is_number` condition make sure the celebration doesn't start after an HA restart or an integration outage, when the sensor briefly has no value. The action name `esphome.led_frame_led_celebrate` comes from the device name (`led-frame`) and the action name in the ESP – if your device is named differently, it changes too.

## What to watch out for

- **Less is more.** A dashboard with everything on it is not clear. Put only what you actually look at.
- **Think of the others.** If the family is going to use it, it must be clear without explanations.
- **Brightness at night.** A glowing display and LED frame are blinding in a dark room – set a night brightness.
- **Tablet battery.** Non-stop charging shortens battery life and in the worse case it swells.
- **The alarm must override everything.** If the LED frame shows alarms, no other animation may cover them.

## Summary

1. A smart home should run itself, but the dashboard shows you whether it really does.
2. Everyone in the family uses it differently – design it for all of them.
3. A tablet is the cheapest, a display + computer is more reliable, a TV is for an occasional look.
4. Hide cables next to a switch or through the wall, mount the display with a holder or magnets.
5. An addressable LED frame extends the dashboard so you see the state of the house from across the room.
6. Design is no longer a limit – with AI you can build a dashboard exactly the way you want.
