// Texts for the lesson game, plus extra questions for lessons that had none.
// "extra" questions: [pedestrians, reversing, exam day]
export const GAME = {
  en: { discover: "Tap the numbers on the picture to discover the rules", found: "Rules found", locked: "Find all rules to unlock the challenge",
    challenge: "Challenge", points: "points", complete: "Lesson complete", tryNext: "Next lesson", total: "Your score", replay: "Play again",
    extra: [
      { q: "Who has priority on a zebra crossing?", o: ["Pedestrians", "Cars", "Whoever is faster"], a: 0 },
      { q: "Can you reverse from a side road into a main road?", o: ["Yes", "No", "Only at night"], a: 1 },
      { q: "What should you do before moving off in the exam?", o: ["Check seat, mirrors and seat belt", "Sound the horn", "Turn on hazard lights"], a: 0 },
    ] },
  ar: { discover: "اضغط على الأرقام في الصورة لاكتشاف القواعد", found: "القواعد المكتشفة", locked: "اكتشف كل القواعد لفتح التحدي",
    challenge: "التحدي", points: "نقطة", complete: "اكتمل الدرس", tryNext: "الدرس التالي", total: "نتيجتك", replay: "العب مرة أخرى",
    extra: [
      { q: "من له الأولوية على ممر المشاة؟", o: ["المشاة", "السيارات", "الأسرع"], a: 0 },
      { q: "هل يمكنك الرجوع للخلف من طريق فرعي إلى طريق رئيسي؟", o: ["نعم", "لا", "ليلاً فقط"], a: 1 },
      { q: "ماذا تفعل قبل التحرك في الاختبار؟", o: ["أفحص المقعد والمرايا والحزام", "أستخدم البوق", "أشغّل إشارات التحذير"], a: 0 },
    ] },
  ur: { discover: "قوانین جاننے کے لیے تصویر پر نمبر دبائیں", found: "ملے ہوئے قوانین", locked: "چیلنج کھولنے کے لیے سارے قوانین تلاش کریں",
    challenge: "چیلنج", points: "پوائنٹس", complete: "سبق مکمل", tryNext: "اگلا سبق", total: "آپ کا اسکور", replay: "دوبارہ کھیلیں",
    extra: [
      { q: "زیبرا کراسنگ پر ترجیح کس کو ہے؟", o: ["پیدل چلنے والوں کو", "گاڑیوں کو", "جو تیز ہو"], a: 0 },
      { q: "کیا آپ چھوٹی سڑک سے مین روڈ پر ریورس کر سکتے ہیں؟", o: ["ہاں", "نہیں", "صرف رات کو"], a: 1 },
      { q: "امتحان میں چلنے سے پہلے کیا کرنا چاہیے؟", o: ["سیٹ، مررز اور بیلٹ چیک کریں", "ہارن بجائیں", "ہیزرڈ لائٹس آن کریں"], a: 0 },
    ] },
  hi: { discover: "नियम जानने के लिए तस्वीर पर नंबर दबाएँ", found: "मिले हुए नियम", locked: "चैलेंज खोलने के लिए सारे नियम ढूँढें",
    challenge: "चैलेंज", points: "पॉइंट", complete: "पाठ पूरा", tryNext: "अगला पाठ", total: "आपका स्कोर", replay: "फिर से खेलें",
    extra: [
      { q: "ज़ेबरा क्रॉसिंग पर प्राथमिकता किसकी है?", o: ["पैदल यात्रियों की", "गाड़ियों की", "जो तेज़ हो"], a: 0 },
      { q: "क्या आप छोटी सड़क से मुख्य सड़क पर रिवर्स कर सकते हैं?", o: ["हाँ", "नहीं", "सिर्फ़ रात में"], a: 1 },
      { q: "परीक्षा में चलने से पहले क्या करना चाहिए?", o: ["सीट, मिरर और बेल्ट जाँचें", "हॉर्न बजाएँ", "हैज़र्ड लाइट चालू करें"], a: 0 },
    ] },
  ml: { discover: "നിയമങ്ങൾ അറിയാൻ ചിത്രത്തിലെ നമ്പറുകളിൽ തൊടുക", found: "കണ്ടെത്തിയ നിയമങ്ങൾ", locked: "ചലഞ്ച് തുറക്കാൻ എല്ലാ നിയമങ്ങളും കണ്ടെത്തുക",
    challenge: "ചലഞ്ച്", points: "പോയിന്റ്", complete: "പാഠം പൂർത്തിയായി", tryNext: "അടുത്ത പാഠം", total: "നിങ്ങളുടെ സ്കോർ", replay: "വീണ്ടും കളിക്കുക",
    extra: [
      { q: "സീബ്രാ ക്രോസിംഗിൽ ആർക്കാണ് മുൻഗണന?", o: ["കാൽനടക്കാർക്ക്", "കാറുകൾക്ക്", "വേഗതയുള്ളവർക്ക്"], a: 0 },
      { q: "ചെറിയ റോഡിൽ നിന്ന് പ്രധാന റോഡിലേക്ക് റിവേഴ്സ് ചെയ്യാമോ?", o: ["ഉവ്വ്", "ഇല്ല", "രാത്രിയിൽ മാത്രം"], a: 1 },
      { q: "പരീക്ഷയിൽ നീങ്ങുന്നതിന് മുമ്പ് എന്ത് ചെയ്യണം?", o: ["സീറ്റ്, മിററുകൾ, ബെൽറ്റ് പരിശോധിക്കുക", "ഹോൺ അടിക്കുക", "ഹസാർഡ് ലൈറ്റ് ഓണാക്കുക"], a: 0 },
    ] },
  zh: { discover: "点击图片上的数字来发现规则", found: "已发现的规则", locked: "找到全部规则即可解锁挑战",
    challenge: "挑战", points: "分", complete: "本课完成", tryNext: "下一课", total: "你的得分", replay: "再玩一次",
    extra: [
      { q: "在斑马线上谁有优先权？", o: ["行人", "汽车", "谁快谁先"], a: 0 },
      { q: "可以从小路倒车进入主路吗？", o: ["可以", "不可以", "只在晚上可以"], a: 1 },
      { q: "考试中起步前应该做什么？", o: ["检查座椅、后视镜和安全带", "按喇叭", "打开双闪灯"], a: 0 },
    ] },
};

// Which questions belong to which lesson. Numbers = index in T.quiz, "x0".."x2" = GAME.extra.
export const LESSON_QUESTIONS = [[7], [0, 6], [1, 2, 3], [4], [5], ["x0"], ["x1"], ["x2"]];
