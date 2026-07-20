import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { QrCode, UtensilsCrossed } from "lucide-react";

export function TableSelection() {
  const navigate = useNavigate();
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UtensilsCrossed className="w-12 h-12 text-sky-600" />
            <h1 className="text-4xl font-bold text-slate-900">مطعم هاوس</h1>
          </div>
          <p className="text-lg text-gray-600">اختر طاولتك لعرض القائمة وتقديم الطلب</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <QrCode className="w-4 h-4" />
            <span>امسح رمز الاستجابة السريعة على طاولتك أو اختر من الأسفل</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>الطاولات المتاحة</CardTitle>
            <CardDescription>اختر رقم الطاولة لبدء الطلب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {tables.map((tableNum) => (
                <Button
                  key={tableNum}
                  variant="outline"
                  className="h-20 text-lg font-semibold hover:bg-sky-100 hover:border-sky-500 text-slate-900"
                  onClick={() => navigate(`/table/${tableNum}`)}
                >
                  طاولة {tableNum}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>في الاستخدام الفعلي، سيأخذك مسح رمز الاستجابة السريعة مباشرة إلى قائمة طاولتك</p>
        </div>
      </div>
    </div>
  );
}
