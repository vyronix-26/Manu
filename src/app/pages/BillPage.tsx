import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Printer, CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react";
import { CartItem } from "../types/menu";
import { getOrderByTable, completeOrder, clearOrder } from "../utils/orderStorage";

export function BillPage() {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableNumber) {
      const existingOrder = getOrderByTable(tableNumber);
      if (existingOrder) {
        setCart(existingOrder.items);
        completeOrder(tableNumber);
      } else {
        navigate(`/table/${tableNumber}`);
      }
    }
  }, [tableNumber, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const handlePrint = () => {
    window.print();
  };

  const handlePayment = (method: string) => {
    setPaymentMethod(method);
    setTimeout(() => {
      setIsPaid(true);
      if (tableNumber) {
        clearOrder(tableNumber, total);
        setTimeout(() => {
          navigate(`/rating/${tableNumber}`);
        }, 2000);
      }
    }, 1500);
  };

  const handleNewOrder = () => {
    if (tableNumber) {
      navigate(`/table/${tableNumber}`);
    }
  };

  if (isPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mb-2">شكراً لتناولك الطعام معنا</p>
            <p className="text-sm text-gray-500 mb-8">طاولة {tableNumber} • مطعم هاوس</p>
            <div className="space-y-2">
              <Button onClick={handleNewOrder} className="w-full" size="lg">
                طلب جديد
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Bill Card */}
        <Card ref={billRef} className="print:shadow-none">
          <CardHeader className="text-center border-b">
            <div className="space-y-1">
              <CardTitle className="text-3xl">فندق أرياس</CardTitle>
              <p className="text-sm text-gray-600">123 شارع الرئيسي، المدينة</p>
              <p className="text-sm text-gray-600">الهاتف: +91 1234567890</p>
              <p className="text-sm text-gray-600">GSTIN: 29ABCDE1234F1Z5</p>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-semibold">طاولة: {tableNumber}</p>
                  <p className="text-gray-600">التاريخ: {new Date().toLocaleDateString()}</p>
                  <p className="text-gray-600">الوقت: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">فاتورة</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 font-semibold text-sm border-b pb-2">
                  <div className="col-span-6">الصنف</div>
                  <div className="col-span-2 text-center">الكمية</div>
                  <div className="col-span-2 text-right">السعر</div>
                  <div className="col-span-2 text-right">المبلغ</div>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 text-sm">
                    <div className="col-span-6">{item.name}</div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">₪{item.price}</div>
                    <div className="col-span-2 text-right">₪{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Separator />
                <div className="flex justify-between">
                  <span className="text-lg font-bold">الإجمالي الكلي</span>
                  <span className="text-2xl font-bold text-sky-600">₪{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center text-sm text-gray-600">
                <p>شكراً لتناول الطعام معنا!</p>
                <p className="mt-1">نتمنى رؤيتك مرة أخرى قريباً</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle>طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handlePayment("cash")}
              variant={paymentMethod === "cash" ? "default" : "outline"}
              className="w-full justify-start"
              size="lg"
              disabled={paymentMethod !== null}
            >
              <Banknote className="w-5 h-5 mr-3" />
              الدفع نقداً
            </Button>
            <Button
              onClick={() => handlePayment("card")}
              variant={paymentMethod === "card" ? "default" : "outline"}
              className="w-full justify-start"
              size="lg"
              disabled={paymentMethod !== null}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              الدفع بالبطاقة
            </Button>
            <Button
              onClick={() => handlePayment("upi")}
              variant={paymentMethod === "upi" ? "default" : "outline"}
              className="w-full justify-start"
              size="lg"
              disabled={paymentMethod !== null}
            >
              <Smartphone className="w-5 h-5 mr-3" />
              الدفع عبر UPI
            </Button>

            {paymentMethod && !isPaid && (
              <div className="text-center text-sm text-gray-600 pt-4">
                جاري معالجة الدفع...
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={handlePrint} variant="outline" className="w-full print:hidden" size="lg">
          <Printer className="w-5 h-5 mr-2" />
          طباعة الفاتورة
        </Button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #bill-content, #bill-content * { visibility: visible; }
          #bill-content { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
}
