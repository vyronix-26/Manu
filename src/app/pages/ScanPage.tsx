import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Utensils } from "lucide-react";

export function ScanPage() {
  const navigate = useNavigate();

  return (
    // قمنا باستبدال الـ bg-gradient بـ bg-transparent لتظهر الصورة الخلفية بوضوح
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <Card className="text-center shadow-xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center shadow-lg shadow-sky-200/50">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sky-700 text-lg leading-tight">مطعم هاوس</p>
                <p className="text-xs text-slate-500">مطعم فاخر</p>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-2">
              مرحباً بك في مطعم هاوس
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              اختر طاولتك ثم استمتع بالقائمة مباشرة.
            </p>

            <Button
              size="lg"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              onClick={() => navigate("/select")}
            >
              اختر طاولتي
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}