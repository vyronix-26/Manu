import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function RatingPage() {
  const navigate = useNavigate();
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم");
      return;
    }

    // Save rating to localStorage
    const ratings = JSON.parse(localStorage.getItem("hotel_ratings") || "[]");
    ratings.push({
      tableNumber,
      rating,
      comment,
      timestamp: Date.now(),
    });
    localStorage.setItem("hotel_ratings", JSON.stringify(ratings));

    setSubmitted(true);
    toast.success("شكراً لملاحظاتك!");
  };

  const handleGoogleReview = () => {
    // In a real app, this would open Google Maps with the business location
    // For demo, we'll just show a message
    window.open("https://www.google.com/search?q=grand+hotel+reviews", "_blank");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-sky-600 fill-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">شكراً لك!</h2>
            <p className="text-gray-600 mb-8">
              تساعدنا ملاحظاتك على تحسين خدماتنا
            </p>

            {rating >= 4 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  هل أعجبك خدمتنا؟
                </p>
                <p className="text-xs text-blue-700 mb-3">
                  ساعد الآخرين في اكتشاف فندق أرياس بكتابة تقييم على جوجل!
                </p>
                <Button
                  onClick={handleGoogleReview}
                  variant="outline"
                  className="w-full border-blue-300 hover:bg-blue-100"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  تقييم على جوجل
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={() => navigate(`/table/${tableNumber}`)}
                className="w-full"
                size="lg"
              >
                طلب جديد
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">قيّم تجربتك</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            طاولة {tableNumber} • مطعم هاوس 
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div>
            <p className="text-center text-sm text-gray-600 mb-4">
              كيف كانت تجربتك في تناول الطعام؟
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? "text-sky-500 fill-sky-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-3 font-semibold text-gray-700">
                {rating === 5 && "ممتاز! ⭐"}
                {rating === 4 && "جيد جداً! 😊"}
                {rating === 3 && "جيد 👍"}
                {rating === 2 && "مقبول 😐"}
                {rating === 1 && "ضعيف 😞"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أخبرنا المزيد (اختياري)
            </label>
            <Textarea
              placeholder="شارك تجربك معنا..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={rating === 0}
          >
            إرسال التقييم
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full"
          >
            تخطي الآن
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
