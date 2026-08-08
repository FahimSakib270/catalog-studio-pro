import type { Product } from "../types/catalog";

/**
 * One placeholder product used to bootstrap the studio on first launch.
 * Fully conforms to the schemaVersion-2 product data shape.
 */
export const seedProduct: Product = {
  modelCode: "CSP-2000",
  hsCode: "8517.62",
  titleLinesEn: "Smart\nDisplay Terminal",
  titleLinesZh: "智能\n显示终端",
  taglineEn: "A professional-grade interactive display for modern retail.",
  taglineZh: "面向现代零售的专业级交互显示终端。",
  overviewLeadEn:
    "Engineered for clarity and durability, the CSP-2000 brings your content to life with vivid color and responsive touch.",
  overviewLeadZh:
    "CSP-2000 以清晰与耐用为设计核心，以鲜艳色彩与灵敏触控让内容生动呈现。",
  calloutTitleEn: "Built for the floor",
  calloutTitleZh: "为门店而生",
  calloutBodyEn:
    "Rugged, fanless, and ready for 24/7 operation in demanding environments.",
  calloutBodyZh: "坚固无风扇设计，可满足严苛环境下的全天候运行。",
  specs: [
    { en: "Display", zh: "显示屏", val: '21.5" IPS 1080p' },
    { en: "Touch", zh: "触控", val: "10-point capacitive" },
    { en: "CPU", zh: "处理器", val: "Quad-core A55" },
    { en: "Memory", zh: "内存", val: "4GB RAM / 32GB eMMC" },
    { en: "Connectivity", zh: "连接", val: "Wi-Fi 6 · BT 5.2 · LAN" },
    { en: "Power", zh: "电源", val: "DC 12V · 24W" },
  ],
  packaging: [
    "Unit ×1",
    "Mounting bracket ×1",
    "Power adapter ×1",
    "Quick guide ×1",
  ],
  ribbon: ["In stock", "2-year warranty"],
  detection: ["People counting", "Face detection", "QR scan"],
  audienceEn: "Retail, hospitality, and corporate lobbies.",
  audienceZh: "零售、餐饮及企业大堂等场景。",
  trust: ["CE", "FCC", "RoHS"],
  warranty: ["2-year limited warranty", "Free firmware updates"],
  afterSales: ["Email support", "Remote diagnostics", "Spare parts"],
  includedEn: "Wall mount, power adapter, and quick-start guide.",
  includedNoteEn: "Stand sold separately.",
  includedZh: "含壁挂支架、电源适配器及快速入门指南。",
  includedNoteZh: "底座需单独购买。",
  terms: ["Prices exclude VAT", "Lead time 7–10 days", "MOQ 1 unit"],
  sectionTitles: {
    overview: "Overview",
    specs: "Specifications",
    variants: "Models",
    included: "In the Box",
    terms: "Terms",
  },
  footerTaglineEn: "Designed to perform. Built to last.",
  footerTaglineZh: "为性能而设计，为持久而打造。",
  aboutPage: true,
  aboutEn:
    "Catalog Studio Pro is a design tool for building product brochures.",
  aboutZh: "Catalog Studio Pro 是一款用于制作产品手册的设计工具。",
  variants: {
    touchscreen: {
      editionEn: "Touchscreen Edition",
      editionZh: "触控版",
      kickerEn: "Flagship",
      kickerZh: "旗舰",
      badgeEn: "Best seller",
      badgeZh: "热销",
      price: {
        currency: "USD",
        value: 499,
        labelEn: "USD",
        labelZh: "美元",
        perSetEn: "per set",
        perSetZh: "每套",
      },
      features: ["10-point touch", "Auto-brightness", "Android 13"],
    },
    button: {
      editionEn: "Button Edition",
      editionZh: "按键版",
      kickerEn: "Essential",
      kickerZh: "基础",
      badgeEn: "Value",
      badgeZh: "实惠",
      price: {
        currency: "USD",
        value: 399,
        labelEn: "USD",
        labelZh: "美元",
        perSetEn: "per set",
        perSetZh: "每套",
      },
      features: ["Physical keys", "Low power", "Android 13"],
    },
  },
  images: {
    logo: { dataUrl: "", ratio: 1 },
    product: { dataUrl: "", ratio: 1 },
    inUse: { dataUrl: "", ratio: 1 },
    qr: { dataUrl: "", ratio: 1 },
  },
  templateId: "onyx-editorial",
};
