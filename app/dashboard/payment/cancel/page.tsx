import type { Metadata } from "next";
import Link from "next/link";
import { PaymentPageShell } from "@/components/organisms/PaymentPageShell";
import { ErrorDetailsCard } from "@/components/organisms/ErrorDetailsCard";
import { XCircle, Headset, ArrowRight, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Failed | My Insurance Quoter",
  description:
    "We were unable to complete your transaction. Please try a different payment method.",
};

export default function PaymentCancelPage() {
  return (
    <PaymentPageShell currentStep={2}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero: red error icon + heading + subtitle */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-red-100 rounded-xl shadow-[0_0_0_8px_#fef2f2] size-20 flex items-center justify-center">
            <XCircle className="size-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payment Could Not Be Processed
          </h1>
          <p className="text-lg text-slate-500">
            We were unable to complete your transaction
          </p>
        </div>

        {/* Timer alert */}
        <div className="bg-orange-50 border border-orange-200 rounded p-4 flex items-center justify-center gap-3">
          <Timer className="size-6 text-orange-600 shrink-0" />
          <p className="text-sm font-medium text-orange-800">
            Quote &amp; application saved. Expires in:{" "}
            <span className="font-mono font-bold text-base">23:45:12</span>
          </p>
        </div>

        {/* Error details card */}
        <ErrorDetailsCard />

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="border border-slate-300 rounded px-6 py-2.5 text-base font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Headset className="size-4" />
            Contact Support
          </button>
          <Link
            href="/dashboard/payment"
            className="bg-[#1773cf] text-white rounded px-6 py-2.5 text-base font-medium shadow-[0_1px_2px_rgba(23,115,207,0.3)] hover:bg-[#1565b8] transition-colors flex items-center gap-2"
          >
            Try Different Payment Method
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Return link */}
        <p className="text-center text-xs text-slate-500">
          Need to review the application?{" "}
          <Link href="/dashboard" className="text-[#1773cf] hover:underline">
            Return to application review
          </Link>
        </p>
      </div>
    </PaymentPageShell>
  );
}
