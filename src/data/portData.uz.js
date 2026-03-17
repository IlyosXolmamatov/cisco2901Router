const portData = {
  "GE_0_0": {
    nomi: "GE 0/0 — Gigabit Ethernet",
    tezlik: "10/100/1000 Mbps",
    konnektyor: "RJ-45",
    vazifa: "WAN yoki LAN asosiy port",
    status: "🟢 Faol",
    maxsus: "Auto-MDI/MDIX",
    standart: "IEEE 802.3ab",
    rang: "#B8860B"
  },
  "GE_0_1": {
    nomi: "GE 0/1 — Gigabit Ethernet",
    tezlik: "10/100/1000 Mbps",
    konnektyor: "RJ-45",
    vazifa: "LAN/WAN port",
    status: "🟢 Faol",
    maxsus: "Auto-MDI/MDIX",
    standart: "IEEE 802.3ab",
    rang: "#B8860B"
  },
  "EHWIC_1": {
    nomi: "EHWIC 1 — Expansion HWIC",
    tezlik: "Modulli",
    konnektyor: "Custom",
    vazifa: "Qo'shimcha modul",
    status: "🟡 Kutmoqda",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "Cisco proprietary",
    rang: "#4682B4"
  },
  "EHWIC_2": {
    nomi: "EHWIC 2 — Expansion HWIC",
    tezlik: "Modulli",
    konnektyor: "Custom",
    vazifa: "Qo'shimcha modul",
    status: "🟡 Kutmoqda",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "Cisco proprietary",
    rang: "#4682B4"
  },
  "CONSOLE": {
    nomi: "Console Port",
    tezlik: "115200 bps",
    konnektyor: "RJ-45",
    vazifa: "Konfiguratsiya",
    status: "🟢 Faol",
    maxsus: "Local management",
    standart: "Cisco proprietary",
    rang: "#228B22"
  },
  "AUX": {
    nomi: "AUX Port",
    tezlik: "115200 bps",
    konnektyor: "RJ-45",
    vazifa: "Remote management",
    status: "🟡 Kutmoqda",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "Cisco proprietary",
    rang: "#228B22"
  },
  "USB_0": {
    nomi: "USB 0",
    tezlik: "480 Mbps",
    konnektyor: "USB Type-A",
    vazifa: "Storage/Config",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "USB 2.0",
    rang: "#4682B4"
  },
  "USB_1": {
    nomi: "USB 1",
    tezlik: "480 Mbps",
    konnektyor: "USB Type-A",
    vazifa: "Storage/Config",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "USB 2.0",
    rang: "#4682B4"
  },
  "CF": {
    nomi: "CompactFlash Slot",
    tezlik: "50 MBps",
    konnektyor: "CF",
    vazifa: "Storage",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "CF",
    rang: "#B8860B"
  },
  "FAN": {
    nomi: "Fan",
    tezlik: "N/A",
    konnektyor: "N/A",
    vazifa: "Sovutish",
    status: "🟢 Faol",
    maxsus: "Auto",
    standart: "N/A",
    rang: "#2B2B2B"
  },
  "POWER": {
    nomi: "Power Input",
    tezlik: "220V",
    konnektyor: "IEC",
    vazifa: "Quvvat",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "IEC",
    rang: "#B22222"
  },
  "RAM": {
    nomi: "RAM Slot",
    tezlik: "DDR2",
    konnektyor: "DIMM",
    vazifa: "Xotira",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "DDR2",
    rang: "#4682B4"
  },
  "CPU": {
    nomi: "CPU",
    tezlik: "800 MHz",
    konnektyor: "BGA",
    vazifa: "Protsessor",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "Cisco proprietary",
    rang: "#2B2B2B"
  },
  "SYS_LED": {
    nomi: "System LED",
    tezlik: "N/A",
    konnektyor: "LED",
    vazifa: "Holat",
    status: "🟢 Faol",
    maxsus: "Green",
    standart: "N/A",
    rang: "#00FF00"
  },
  "ACT_LED": {
    nomi: "Activity LED",
    tezlik: "N/A",
    konnektyor: "LED",
    vazifa: "Faollik",
    status: "🟢 Faol",
    maxsus: "Yellow",
    standart: "N/A",
    rang: "#FFFF00"
  },
  "POE_LED": {
    nomi: "PoE LED",
    tezlik: "N/A",
    konnektyor: "LED",
    vazifa: "PoE holati",
    status: "🟢 Faol",
    maxsus: "Blue",
    standart: "N/A",
    rang: "#4682B4"
  },
  "RESET": {
    nomi: "Reset Button",
    tezlik: "N/A",
    konnektyor: "Button",
    vazifa: "Qayta ishga tushirish",
    status: "🟡 Kutmoqda",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "Cisco proprietary",
    rang: "#B22222"
  },
  "REAR_PANEL": {
    nomi: "Rear Panel",
    tezlik: "N/A",
    konnektyor: "N/A",
    vazifa: "Orqa panel",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "N/A",
    rang: "#2B2B2B"
  },
  "FRONT_PANEL": {
    nomi: "Front Panel",
    tezlik: "N/A",
    konnektyor: "N/A",
    vazifa: "Old panel",
    status: "🟢 Faol",
    maxsus: "Qo'llab-quvvatlanadi",
    standart: "N/A",
    rang: "#2B2B2B"
  }
};