import type { Metadata } from "next";
import Link from "next/link";
import { PaymentPageShell } from "@/components/organisms/PaymentPageShell";
import { ConfirmationDetailsCard } from "@/components/organisms/ConfirmationDetailsCard";
import { WhatsNextStepper } from "@/components/molecules/WhatsNextStepper";
import { CheckCircle, Download, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful | My Insurance Quoter",
  description:
    "Your application has been submitted to Prudential. View your confirmation details.",
};

export default function PaymentSuccessPage() {
  return (
    <PaymentPageShell currentStep={3}>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Hero: green check + heading + subtitle */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-green-100 rounded-xl shadow-[0_0_0_8px_#f0fdf4] size-20 flex items-center justify-center">
            <CheckCircle className="size-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-500">
            Your application has been submitted to Prudential
          </p>
        </div>

        {/* Confirmation details card */}
        <ConfirmationDetailsCard />

        {/* What Happens Next */}
        <WhatsNextStepper />

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            className="border border-slate-300 rounded px-6 py-2.5 text-base font-medium text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Download className="size-4" />
            Download Receipt
          </button>
          <Link
            href="/dashboard"
            className="bg-[#1773cf] text-white rounded px-6 py-2.5 text-base font-medium shadow-[0_1px_2px_rgba(23,115,207,0.3)] hover:bg-[#1565b8] transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>

        {/* Email link */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="text-[#1773cf] text-sm font-medium flex items-center gap-1 hover:underline"
          >
            <Mail className="size-3.5" />
            Email Confirmation Again
          </button>
        </div>
      </div>
    </PaymentPageShell>
  );
}
