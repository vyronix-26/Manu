import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Plus, Minus, XCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { CartItem } from "../types/menu";
import { getOrderByTable, saveOrder, cancelItem } from "../utils/orderStorage";
import { toast } from "sonner";

const CANCEL_WINDOW_MS = 4 * 60 * 1000; // 4 minutes

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CartPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cancelledItems, setCancelledItems] = useState<CartItem[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (tableNumber) {
      const existingOrder = getOrderByTable(tableNumber);
      if (existingOrder) {
        setCart(existingOrder.items);
        setCancelledItems(existingOrder.cancelledItems || []);
      }
    }
  }, [tableNumber]);

  // Tick every second to update countdown timers
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tableNumber && cart.length > 0) {
      saveOrder(tableNumber, cart);
    }
  }, [cart, tableNumber]);

  const updateQuantity = (itemId: string, change: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;
      const newQuantity = existing.quantity + change;
      if (newQuantity <= 0) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i));
    });
  };

  const handleCancelItem = (itemId: string, itemName: string) => {
    if (!tableNumber) return;
    const success = cancelItem(tableNumber, itemId);
    if (success) {
      const cancelledItem = cart.find(i => i.id === itemId);
      if (cancelledItem) setCancelledItems(prev => [...prev, { ...cancelledItem, status: "cancelled" }]);
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      toast.success(`${itemName} تم إلغاءه بنجاح`);
    } else {
      toast.error("انتهت مهلة الإلغاء (مرّت 4 دقائق)");
    }
  };

  const getRemainingCancelTime = (item: CartItem): number => {
    const orderedAt = item.orderedAt || Date.now();
    return CANCEL_WINDOW_MS - (now - orderedAt);
  };

  const canCancelItem = (item: CartItem): boolean => {
    return getRemainingCancelTime(item) > 0;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handleFinishOrder = () => {
    if (tableNumber) navigate(`/bill/${tableNumber}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "cooking": return "bg-sky-100 text-sky-700";
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-rose-100 text-rose-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "cooking": return "قيد التحضير";
      case "delivered": return "مقدم";
      case "cancelled": return "ملغى";
      default: return "قيد الانتظار";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/table/${tableNumber}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">طلبك</h1>
              <p className="text-sm text-gray-600">طاولة {tableNumber} • مطعم هاوس</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {cart.length === 0 && cancelledItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">السلة فارغة</p>
              <Button onClick={() => navigate(`/table/${tableNumber}`)}>تصفح القائمة</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>عناصر الطلب</CardTitle>
                    <CardDescription>{cart.length} عنصر • تم الإرسال إلى المطبخ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
  {cart.map((item) => {
    const cancellable = canCancelItem(item);
    const remaining = getRemainingCancelTime(item);
    return (
      <div key={item.id} className="border rounded-lg p-3 space-y-2">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{item.name}</p>
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {getStatusLabel(item.status)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-0.5">₪{item.price.toFixed(2)} × {item.quantity} = ₪{(item.price * item.quantity).toFixed(2)}</p>
            
            {/* عرض الملاحظة هنا بشكل أنيق تحت السعر إذا كانت موجودة */}
            {item.note && (
              <div className="text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded-md mt-1.5 border border-sky-100 font-medium inline-block">
                ✍️ ملاحظة: {item.note}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Cancel option */}
        {cancellable ? (
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200">
            <div className="flex items-center gap-1 text-xs text-sky-600">
              <Clock className="w-3 h-3" />
              <span>يمكن الإلغاء خلال {formatCountdown(remaining)}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 text-xs"
              onClick={() => handleCancelItem(item.id, item.name)}
            >
              <XCircle className="w-3 h-3 mr-1" />
              إلغاء الصنف
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 pt-1 border-t border-dashed border-gray-200 text-xs text-gray-400">
            <AlertTriangle className="w-3 h-3" />
            <span>انتهت مهلة الإلغاء</span>
          </div>
        )}
      </div>
    );
  })}
</CardContent>
                </Card>
              )}

              {/* Cancelled Items */}
              {cancelledItems.length > 0 && (
                <Card className="border-rose-200 bg-rose-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-rose-700 text-base">أصناف ملغاة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {cancelledItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-rose-100 last:border-0">
                        <div>
                          <span className="font-medium line-through text-gray-500">{item.name}</span>
                          <span className="ml-2 text-xs text-gray-400">×{item.quantity}</span>
                        </div>
                        <Badge variant="outline" className="text-rose-600 border-rose-300 text-xs">ملغى</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                            <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">الإجمالي</span>
                      <span className="text-xl font-bold text-sky-600">₪{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                      <Button onClick={handleFinishOrder} className="w-full" size="lg" disabled={cart.length === 0}>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        إنهاء وطلب الفاتورة
                      </Button>
                      <Button onClick={() => navigate(`/table/${tableNumber}`)} variant="outline" className="w-full">
                        إضافة أصناف أخرى
                      </Button>
                    </div>

                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-700">
                    <p className="font-semibold mb-1">سياسة الإلغاء</p>
                    <p>يمكن إلغاء الأصناف خلال 4 دقائق من الطلب. بعد ذلك يتم قفل الطلب.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
