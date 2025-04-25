export type Locale = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu"

export const locales: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)",
  bn: "বাংলা (Bengali)",
  mr: "मराठी (Marathi)",
  gu: "ગુજરાતી (Gujarati)",
}

export const defaultLocale: Locale = "en"

// Simple translations for demo purposes
export const translations: Record<Locale, Record<string, string>> = {
  en: {
    home: "Home",
    products: "Products",
    orders: "Orders",
    settings: "Settings",
    login: "Login",
    register: "Register",
    addProduct: "Add Product",
    buyOnWhatsApp: "Buy on WhatsApp",
    startSelling: "Start Selling",
    welcomeMessage: "Create your WhatsApp-powered storefront in minutes",
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    orders: "ऑर्डर",
    settings: "सेटिंग्स",
    login: "लॉगिन",
    register: "रजिस्टर",
    addProduct: "उत्पाद जोड़ें",
    buyOnWhatsApp: "व्हाट्सएप पर खरीदें",
    startSelling: "बिक्री शुरू करें",
    welcomeMessage: "मिनटों में अपना व्हाट्सएप-पावर्ड स्टोरफ्रंट बनाएं",
  },
  ta: {
    home: "முகப்பு",
    products: "பொருட்கள்",
    orders: "ஆர்டர்கள்",
    settings: "அமைப்புகள்",
    login: "உள்நுழைய",
    register: "பதிவு செய்ய",
    addProduct: "பொருள் சேர்க்க",
    buyOnWhatsApp: "வாட்ஸ்அப்பில் வாங்க",
    startSelling: "விற்பனை தொடங்க",
    welcomeMessage: "நிமிடங்களில் உங்கள் வாட்ஸ்அப் ஸ்டோர்ஃப்ரண்டை உருவாக்கவும்",
  },
  te: {
    home: "హోమ్",
    products: "ఉత్పత్తులు",
    orders: "ఆర్డర్లు",
    settings: "సెట్టింగ్స్",
    login: "లాగిన్",
    register: "రిజిస్టర్",
    addProduct: "ఉత్పత్తిని జోడించండి",
    buyOnWhatsApp: "వాట్సాప్‌లో కొనుగోలు చేయండి",
    startSelling: "విక్రయాలు ప్రారంభించండి",
    welcomeMessage: "నిమిషాల్లో మీ వాట్సాప్ స్టోర్‌ఫ్రంట్‌ని సృష్టించండి",
  },
  bn: {
    home: "হোম",
    products: "পণ্য",
    orders: "অর্ডার",
    settings: "সেটিংস",
    login: "লগইন",
    register: "রেজিস্টার",
    addProduct: "পণ্য যোগ করুন",
    buyOnWhatsApp: "হোয়াটসঅ্যাপে কিনুন",
    startSelling: "বিক্রয় শুরু করুন",
    welcomeMessage: "মিনিটের মধ্যে আপনার হোয়াটসঅ্যাপ-পাওয়ার্ড স্টোরফ্রন্ট তৈরি করুন",
  },
  mr: {
    home: "होम",
    products: "उत्पादने",
    orders: "ऑर्डर",
    settings: "सेटिंग्ज",
    login: "लॉगिन",
    register: "नोंदणी",
    addProduct: "उत्पादन जोडा",
    buyOnWhatsApp: "व्हाट्सअॅपवर खरेदी करा",
    startSelling: "विक्री सुरू करा",
    welcomeMessage: "मिनिटांमध्ये आपले व्हाट्सअॅप-पॉवर्ड स्टोअरफ्रंट तयार करा",
  },
  gu: {
    home: "હોમ",
    products: "ઉત્પાદનો",
    orders: "ઓર્ડર",
    settings: "સેટિંગ્સ",
    login: "લોગિન",
    register: "રજિસ્ટર",
    addProduct: "ઉત્પાદન ઉમેરો",
    buyOnWhatsApp: "વોટ્સએપ પર ખરીદો",
    startSelling: "વેચાણ શરૂ કરો",
    welcomeMessage: "મિનિટોમાં તમારું વોટ્સએપ-પાવર્ડ સ્ટોરફ્રન્ટ બનાવો",
  },
}

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale][key] || translations[defaultLocale][key] || key
}
