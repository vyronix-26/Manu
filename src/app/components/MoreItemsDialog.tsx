import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface MoreItemsDialogProps {
  onContinueShopping: () => void;
  onFinish: () => void;
  lastOrderTime: number | null;
}

export function MoreItemsDialog({ onContinueShopping, onFinish, lastOrderTime }: MoreItemsDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!lastOrderTime) return;

    const timeSinceOrder = Date.now() - lastOrderTime;
    const timeUntilPrompt = Math.max(0, 10 * 60 * 1000 - timeSinceOrder); // 10 minutes

    const timer = setTimeout(() => {
      setOpen(true);
    }, timeUntilPrompt);

    return () => clearTimeout(timer);
  }, [lastOrderTime]);

  const handleContinue = () => {
    setOpen(false);
    onContinueShopping();
  };

  const handleFinish = () => {
    setOpen(false);
    onFinish();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل ترغب في طلب المزيد من الأصناف؟</AlertDialogTitle>
          <AlertDialogDescription>
            مر وقت منذ آخر طلب لك. هل ترغب في إضافة المزيد من الأصناف إلى طلبك أم أنك جاهز للحصول على الفاتورة؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleFinish}>عرض الفاتورة</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>طلب المزيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
