"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import { mockCourses } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { 
  CreditCard, 
  Tag, 
  ShoppingBag, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId") || "course-1";
  const course = mockCourses.find(c => c.id === courseId);

  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  
  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "razorpay">("card");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Price computations
  const basePrice = useMemo(() => {
    if (!course) return 0;
    return course.discountPrice || course.price;
  }, [course]);

  const discountAmount = useMemo(() => {
    return Math.round((basePrice * discountPercent) / 100);
  }, [basePrice, discountPercent]);

  const finalTotal = useMemo(() => {
    return Math.max(0, basePrice - discountAmount);
  }, [basePrice, discountAmount]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.toUpperCase() === "WELCOME20") {
      setDiscountPercent(20);
      setCouponSuccess("Coupon WELCOME20 applied! 20% discount subtracted.");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME20!");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate gateway redirect states
    setTimeout(() => {
      setIsLoading(false);
      // We will route to success
      router.push("/checkout/success");
    }, 2000);
  };

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Checkout item not found</h2>
        <Button asChild>
          <Link href="/courses">Return to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-10 md:py-16">
      <div className="container max-w-5xl mx-auto px-6 space-y-8">
        
        {/* Back Link */}
        <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Return to Course Page
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Billing Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
              Checkout
            </h1>

            {/* Payment Method Selector */}
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-5 rounded-2xl space-y-4 shadow-sm">
              <h2 className="font-bold text-sm text-[var(--text-main)]">1. Select Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "card", label: "Credit Card", icon: CreditCard },
                  { id: "paypal", label: "PayPal", desc: "Global Wallet" },
                  { id: "razorpay", label: "Razorpay", desc: "UPI / Netbanking" }
                ].map((gateway) => (
                  <button
                    key={gateway.id}
                    type="button"
                    onClick={() => setPaymentMethod(gateway.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer ${paymentMethod === gateway.id ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] font-semibold" : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--secondary-bg)]/30"}`}
                  >
                    {gateway.icon ? (
                      <CreditCard className="w-5 h-5" />
                    ) : (
                      <span className="text-xs font-black uppercase tracking-wider">{gateway.id}</span>
                    )}
                    <span className="text-[10px]">{gateway.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCheckoutSubmit} className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-2xl space-y-6 shadow-sm">
              <h2 className="font-bold text-sm text-[var(--text-main)]">2. Billing & Payment Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="billingName">Full Name</label>
                  <input
                    id="billingName"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="billingEmail">Email Address</label>
                  <input
                    id="billingEmail"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                  />
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 pt-2 border-t border-[var(--border-color)]/50">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="cardNumber">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input
                        id="cardNumber"
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="cardExpiry">Expiration Date</label>
                      <input
                        id="cardExpiry"
                        type="text"
                        required
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="cardCvv">Security Code (CVV)</label>
                      <input
                        id="cardCvv"
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== "card" && (
                <div className="p-4 bg-[var(--secondary-bg)]/50 border border-[var(--border-color)]/70 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--primary)] shrink-0" />
                  <span>You will be securely redirected to the selected gateway wallet client to complete authorization after submitting.</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? "Validating Credentials..." : `Pay $${finalTotal} & Enroll`}
              </Button>
            </form>
          </div>

          {/* Checkout Right Column Summary Card */}
          <aside className="space-y-6 lg:mt-14">
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl p-5 shadow-sm space-y-6">
              <h2 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5 pb-3 border-b border-[var(--border-color)]/60">
                <ShoppingBag className="w-4 h-4" /> Order Summary
              </h2>

              {/* Course Detail Card Summary */}
              <div className="flex gap-3">
                <div className="w-16 h-12 relative rounded overflow-hidden shrink-0 bg-[var(--secondary-bg)] border border-[var(--border-color)]/50">
                  <SafeImage src={course.coverImage} alt={course.title} fill className="object-cover" />
                </div>
                <div className="overflow-hidden space-y-0.5">
                  <h3 className="font-bold text-xs text-[var(--text-main)] truncate">{course.title}</h3>
                  <p className="text-[10px] text-[var(--text-secondary)]">Instructor: {course.instructor}</p>
                </div>
              </div>

              {/* Coupon inputs */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[var(--background)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-8 rounded-lg px-3 text-xs font-semibold cursor-pointer">
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-green-600 font-medium flex items-center gap-1"><Sparkles className="w-3 h-3" /> {couponSuccess}</p>}
              </form>

              {/* Computations list */}
              <div className="space-y-2.5 text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)]/60 pt-4">
                <div className="flex justify-between">
                  <span>Price</span>
                  <span>${basePrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[var(--text-main)] border-t border-[var(--border-color)]/40 pt-2.5">
                  <span>Total Cost</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--text-secondary)]">
                <Lock className="w-3 h-3 text-[var(--primary)]" />
                <span>SSL Encrypted Checkout</span>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-[var(--text-secondary)]">Loading checkout gateway...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
