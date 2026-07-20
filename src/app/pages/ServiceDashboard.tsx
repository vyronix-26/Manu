import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import {
  ChefHat, Clock, CheckCircle, UtensilsCrossed, AlertTriangle,
  X, TrendingUp, ShoppingBag, XCircle, Star, BarChart3,
} from "lucide-react";
import { getOrders, updateItemStatus, getAnalytics, getRatings } from "../utils/orderStorage";
import { Order, AnalyticsData, RatingRecord } from "../types/menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const SIX_MINUTES = 6 * 60 * 1000;

interface OverdueAlert {
  tableNumber: string;
  itemName: string;
  itemId: string;
  waitMinutes: number;
  status: string;
}

export function ServiceDashboard() {
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [filter, setFilter] = useState<"all" | "pending" | "cooking" | "delivered">("all");
  const [overdueAlerts, setOverdueAlerts] = useState<OverdueAlert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ completedOrders: [], cancelledItems: [] });
  const [ratings, setRatings] = useState<RatingRecord[]>([]);

  const refreshOrders = () => {
    setOrders(getOrders());
  };

  const checkOverdue = (currentOrders: Record<string, Order>) => {
    const alerts: OverdueAlert[] = [];
    const now = Date.now();
    Object.values(currentOrders).forEach(order => {
      if (order.status !== "active") return;
      order.items.forEach(item => {
        if (item.status === "delivered" || item.status === "cancelled") return;
        const orderedAt = item.orderedAt || order.timestamp;
        const waited = now - orderedAt;
        if (waited > SIX_MINUTES) {
          alerts.push({
            tableNumber: order.tableNumber,
            itemName: item.name,
            itemId: item.id,
            waitMinutes: Math.floor(waited / 60000),
            status: item.status || "pending",
          });
        }
      });
    });
    setOverdueAlerts(alerts);
    if (alerts.length > 0) setShowAlertModal(true);
  };

  const refreshAnalytics = () => {
    setAnalytics(getAnalytics());
    setRatings(getRatings());
  };

  useEffect(() => {
    refreshOrders();
    refreshAnalytics();
    const ordersInterval = setInterval(() => {
      const fresh = getOrders();
      setOrders(fresh);
      checkOverdue(fresh);
    }, 15000);
    // Initial overdue check after 1s
    const initialCheck = setTimeout(() => {
      const fresh = getOrders();
      checkOverdue(fresh);
    }, 1000);
    return () => {
      clearInterval(ordersInterval);
      clearTimeout(initialCheck);
    };
  }, []);

  const handleStatusChange = (tableNumber: string, itemId: string, status: "pending" | "cooking" | "delivered") => {
    updateItemStatus(tableNumber, itemId, status);
    refreshOrders();
  };

  const activeOrders = Object.values(orders).filter(order => order.status === "active");

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending": return "bg-slate-100 text-slate-800 border-slate-300";
      case "cooking": return "bg-sky-100 text-sky-800 border-sky-300";
      case "delivered": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "cooking": return <ChefHat className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "pending": return "قيد الانتظار";
      case "cooking": return "قيد التحضير";
      case "delivered": return "مقدم";
      default: return "قيد الانتظار";
    }
  };

  const filteredOrders = activeOrders.map(order => ({
    ...order,
    items: filter === "all" ? order.items : order.items.filter(item => item.status === filter),
  })).filter(order => order.items.length > 0);

  // Analytics computations
  const totalRevenue = analytics.completedOrders.reduce((s, o) => s + o.revenue, 0);
  const totalOrders = analytics.completedOrders.length;
  const totalItemsOrdered = analytics.completedOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);
  const totalCancellations = analytics.cancelledItems.length;
  const cancelledRevenueLost = analytics.cancelledItems.reduce((s, c) => s + c.itemPrice * c.quantity, 0);
  const avgRating = ratings.length > 0
    ? (ratings.reduce((s: number, r: RatingRecord) => s + r.rating, 0) / ratings.length).toFixed(1)
    : "غير متوفر";

  const ratingDistribution = [1, 2, 3, 4, 5].map(star => ({
    name: `${star}★`,
    count: ratings.filter((r: RatingRecord) => r.rating === star).length,
  }));

  const topItems: Record<string, number> = {};
  analytics.completedOrders.forEach(o => {
    o.items.forEach(i => {
      topItems[i.name] = (topItems[i.name] || 0) + i.quantity;
    });
  });
  const topItemsData = Object.entries(topItems)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const CHART_COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#22c55e", "#a855f7"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 6-Minute Overdue Alert Modal */}
      {showAlertModal && overdueAlerts.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-rose-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white" />
                <div>
                  <p className="text-white font-bold text-lg">تنبيه المطبخ!</p>
                  <p className="text-rose-100 text-sm">{overdueAlerts.length} عنصر متأخر (6 دقائق)</p>
                </div>
              </div>
              <button onClick={() => setShowAlertModal(false)} className="text-white hover:text-rose-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-72 overflow-y-auto">
              {overdueAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-semibold text-gray-800">{alert.itemName}</p>
                    <p className="text-sm text-gray-600">طاولة {alert.tableNumber} • {getStatusLabel(alert.status)}</p>
                  </div>
                  <Badge className="bg-rose-600 text-white border-0">
                    {alert.waitMinutes} دقيقة
                  </Badge>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <Button onClick={() => setShowAlertModal(false)} className="w-full bg-rose-600 hover:bg-rose-700">
                تم الاستلام — جاري العمل عليه!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-8 h-8 text-sky-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">مطعم هاوس — لوحة الخدمة</h1>
                <p className="text-sm text-gray-600">فريق المطبخ والخدمة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {overdueAlerts.length > 0 && (
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="relative flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-semibold">{overdueAlerts.length} متأخر</span>
                </button>
              )}
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {activeOrders.length} طاولة نشطة
              </Badge>
              <Button onClick={() => { refreshOrders(); refreshAnalytics(); }} variant="outline">
                تحديث
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="kitchen">
          <TabsList className="grid w-full grid-cols-2 bg-white mb-6">
            <TabsTrigger value="kitchen" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              طلبات المطبخ
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              التحليلات
            </TabsTrigger>
          </TabsList>

          {/* Kitchen Orders Tab */}
          <TabsContent value="kitchen">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-white">
                <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
                <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
                <TabsTrigger value="cooking">قيد التحضير</TabsTrigger>
                <TabsTrigger value="delivered">مقدم</TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
                <p className="text-gray-500">لا توجد طلبات {filter !== "all" ? filter : "حالياً"}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => {
                  const hasOverdue = order.items.some(item => {
                    if (item.status === "delivered") return false;
                    const orderedAt = item.orderedAt || order.timestamp;
                    return Date.now() - orderedAt > SIX_MINUTES;
                  });
                  return (
                    <Card key={order.tableNumber} className={`hover:shadow-lg transition-shadow ${hasOverdue ? "border-red-300 border-2" : ""}`}>
                      <CardHeader className={`${hasOverdue ? "bg-rose-50" : "bg-gradient-to-r from-slate-50 to-sky-50"}`}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl flex items-center gap-2">
                            طاولة {order.tableNumber}
                            {hasOverdue && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                          </CardTitle>
                          <Badge variant="secondary">{new Date(order.timestamp).toLocaleTimeString()}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {order.items.map((item) => {
                            const orderedAt = item.orderedAt || order.timestamp;
                            const waitMs = Date.now() - orderedAt;
                            const isItemOverdue = waitMs > SIX_MINUTES && item.status !== "delivered";
                            const waitMin = Math.floor(waitMs / 60000);
                            return (
                              <div key={item.id} className={`border rounded-lg p-3 space-y-2 ${isItemOverdue ? "border-rose-300 bg-rose-50" : ""}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span>الكمية: {item.quantity}</span>
                                      <span>•</span>
                                      <span className={isItemOverdue ? "text-rose-600 font-medium" : ""}>{waitMin} دقيقة مضت</span>
                                    </div>
                                  </div>
                                  <Badge className={`${getStatusColor(item.status)} border`}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(item.status)}
                                      {getStatusLabel(item.status)}
                                    </span>
                                  </Badge>
                                </div>

                                <div className="flex gap-2">
                                  <Button size="sm" variant={item.status === "pending" ? "default" : "outline"} className="flex-1"
                                    onClick={() => handleStatusChange(order.tableNumber, item.id, "pending")}>
                                    <Clock className="w-3 h-3 mr-1" />قيد الانتظار
                                  </Button>
                                  <Button size="sm" variant={item.status === "cooking" ? "default" : "outline"} className="flex-1"
                                    onClick={() => handleStatusChange(order.tableNumber, item.id, "cooking")}>
                                    <ChefHat className="w-3 h-3 mr-1" />قيد التحضير
                                  </Button>
                                  <Button size="sm" variant={item.status === "delivered" ? "default" : "outline"} className="flex-1"
                                    onClick={() => handleStatusChange(order.tableNumber, item.id, "delivered")}>
                                    <CheckCircle className="w-3 h-3 mr-1" />مقدم
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                          {/* Cancelled items in this order */}
                          {order.cancelledItems && order.cancelledItems.length > 0 && (
                            <div className="pt-2 border-t border-dashed border-gray-200">
                              <p className="text-xs font-medium text-gray-500 mb-1">أُلغي من العميل:</p>
                              {order.cancelledItems.map((ci, idx) => (
                                <p key={idx} className="text-xs text-gray-400 line-through">{ci.name} ×{ci.quantity}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-base">
                                            ₪
                                </div>
                      <div>
                        <p className="text-xs text-gray-500">إجمالي الإيرادات</p>
                        <p className="text-xl font-bold text-gray-800">₪{totalRevenue.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">إجمالي الطلبات</p>
                        <p className="text-xl font-bold text-gray-800">{totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">الطلبات الملغاة</p>
                        <p className="text-xl font-bold text-gray-800">{totalCancellations}</p>
                        <p className="text-xs text-rose-500">₪{cancelledRevenueLost.toFixed(0)} خسارة</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">متوسط التقييم</p>
                        <p className="text-xl font-bold text-gray-800">{avgRating}</p>
                        <p className="text-xs text-gray-500">{ratings.length} تقييم</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Top Items Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-sky-600" />
                      أكثر الأصناف طلباً
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topItemsData.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">لا توجد بيانات بعد</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={topItemsData} layout="vertical" margin={{ left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Ratings Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-slate-500" />
                      توزيع التقييمات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ratings.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">لا توجد تقييمات بعد</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={ratingDistribution.filter(d => d.count > 0)}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, count }) => `${name}: ${count}`}
                          >
                            {ratingDistribution.map((_, idx) => (
                              <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Cancellation Details */}
              {analytics.cancelledItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-500" />
                      سجل الإلغاء
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-0">
                      <div className="grid grid-cols-4 text-xs font-semibold text-gray-500 pb-2 border-b">
                        <span>الصنف</span>
                        <span className="text-center">الطاولة</span>
                        <span className="text-center">الكمية</span>
                        <span className="text-right">الوقت</span>
                      </div>
                      {analytics.cancelledItems.slice().reverse().slice(0, 15).map((c, idx) => (
                        <div key={idx} className="grid grid-cols-4 text-sm py-2 border-b border-gray-100 last:border-0">
                          <span className="font-medium">{c.itemName}</span>
                          <span className="text-center text-gray-600">{c.tableNumber}</span>
                          <span className="text-center text-gray-600">×{c.quantity}</span>
                          <span className="text-right text-gray-500 text-xs">
                            {new Date(c.cancelledAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الطلبات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-sky-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-sky-600">{totalItemsOrdered}</p>
                      <p className="text-xs text-gray-500 mt-1">إجمالي الأصناف المقدمة</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-blue-600">
                        {totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">متوسط قيمة الطلب (₪)</p>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-rose-600">
                        {totalItemsOrdered > 0 ? ((totalCancellations / (totalItemsOrdered + totalCancellations)) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">نسبة الإلغاء</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-green-600">
                        {ratings.filter((r: RatingRecord) => r.rating >= 4).length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">التقييمات الإيجابية (4-5★)</p>
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  {ratings.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <p className="font-semibold text-gray-700 mb-3">أحدث التقييمات</p>
                      <div className="space-y-3">
                        {ratings.slice().reverse().slice(0, 5).map((r: RatingRecord, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex">
                              {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-sky-500 fill-sky-500" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{r.comment || "بدون تعليق"}</p>
                              <p className="text-xs text-gray-400 mt-1">طاولة {r.tableNumber} • {new Date(r.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
