import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { UtensilsCrossed } from "lucide-react";
import { menuItems } from "../data/menuData";
// background image handled globally via main.tsx
const categories = [
 { key: "special_offer", label: "عرض اليوم ⚡" },
  { key: "drinks", label: "مشروبات" },
  { key: "desserts", label: "حلويات" },
  { key: "appetizers", label: "مقبلات وسلطات" },
  { key: "main_dishes", label: "وجبات رئيسية" },
];
function OfferTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("انتهى العرض");
      } else {
        const h = Math.floor(distance / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${h}h : ${m}m : ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return <div className="text-2xl font-mono text-orange-400 font-bold">{timeLeft}</div>;
}

function isMainDishes(catKey: string) {
  return catKey === "main_dishes";
}

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("main_dishes");

  // تصفية العناصر بناءً على القسم المختار حالياً
  const filteredItems = menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Dark glass overlay to improve contrast over the background image */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/35 to-slate-950/60" />
      <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 20% 0%, rgba(56,189,248,0.25), transparent 45%), radial-gradient(circle at 80% 10%, rgba(124,58,237,0.20), transparent 40%)" }} />

      <div className="relative">
        {/* Header */}
        <div className="sticky top-0 z-10">
          <div className="bg-slate-950/45 backdrop-blur-xl border-b border-white/10 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex justify-center">
                <div className="text-center">
                  <UtensilsCrossed className="w-8 h-8 text-sky-400 mx-auto drop-shadow" />
                  <h1 className="text-2xl font-bold text-white/90">مطعم هاوس</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
       <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          
          {/* 2. شريط الأقسام المتجاوب بالكامل */}
         <div className="sticky top-20 z-30 w-full py-4 overflow-x-auto no-scrollbar">
  <TabsList className="flex gap-2 h-auto bg-neutral-950/90 backdrop-blur-xl border border-white/[0.08] p-2 rounded-2xl w-max min-w-full md:w-full md:max-w-3xl md:mx-auto shadow-[0_10px_35px_rgba(0,0,0,0.6)] justify-start md:justify-center">
    {categories.map((cat) => (
      <TabsTrigger
        key={cat.key}
        value={cat.key}
        className="shrink-0 md:flex-1 text-center px-5 md:px-8 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold text-zinc-400 transition-all duration-300 data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
      >
        {cat.label}
      </TabsTrigger>
    ))}
  </TabsList>
</div>
            <TabsContent value={selectedCategory}>
  {selectedCategory === "special_offer" ? (
    // هذا الجزء يظهر فقط عند اختيار تبويب "عرض اليوم"
    <div className="p-6 bg-neutral-900 border border-orange-500/20 rounded-3xl flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto shadow-2xl" dir="rtl">
                {/* الصورة */}
                <div className="w-full md:w-1/3 min-w-[200px] h-64 rounded-2xl overflow-hidden border border-white/[0.05]">
                  <img
                    src="/img/5cb26d04-6fdb-47be-a30e-0bcf2adc6378.jpg"
                    alt="عرض اليوم"
                    className="w-full h-full object-cover"
                  />
                </div>
               
                {/* النصوص والتحكم */}
                <div className="flex-1 text-right flex flex-col gap-3">
                  {/* العنوان والوصف */}
                  <div>
                    <h2 className="text-2xl font-black text-white">لمّة الشورما العربي 🌯✨</h2>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-1">
                      أربع لفات شورما عربي مقرمشة، محضرة بخبز الصاج المحمص، مع البطاطس والثومية الأصلية.
                    </p>
                  </div>
 <span className="text-2xl font-black text-orange-500">₪50.00</span>
      
      {/* العداد */}
      <div className="mt-2">
        <span className="text-xs text-white/40">ينتهي العرض بعد:</span>
        <OfferTimer targetDate="2026-07-25T23:59:59" />
      </div>
    </div>
 
  </div>
  ) : filteredItems.length > 0 ? (
    // هذا الجزء يظهر لباقي الأقسام (مشروبات، حلويات، إلخ)
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
          style={isMainDishes(selectedCategory) ? { direction: 'rtl' } : { direction: 'ltr' }}
        >
          {/* محتوى البطاقة كما هو */}
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-row-reverse items-start gap-4 justify-between w-full">
              {item.image ? (
                <div className="w-24 h-24 min-w-[96px] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                </div>
              ) : (
                <div className="w-24 h-24 min-w-[96px] rounded-2xl bg-white/5 flex items-center justify-center text-white/40 text-xs border border-white/10">
                  لا توجد صورة
                </div>
              )}
              <div className="flex-1 text-right">
                <CardTitle className="text-lg font-bold text-white/90">{item.name}</CardTitle>
                {item.description && (
                  <CardDescription className="mt-1 text-sm text-white/55 line-clamp-2 leading-relaxed">
                    {item.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row-reverse items-center justify-between">
              <span className="text-xl font-extrabold text-sky-300 drop-shadow">
                ₪{item.price.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    // رسالة عند عدم وجود عناصر
    <div className="text-center text-white/60 py-16">لا توجد عناصر في هذا القسم حالياً.</div>
  )}
</TabsContent>
        </Tabs>
      </div>
          </div>
  );
}

