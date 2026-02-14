import type { Metadata } from "next";
import { PaymentPageShell } from "@/components/organisms/PaymentPageShell";
import { OrderSummaryCard } from "@/components/organisms/OrderSummaryCard";
import { PaymentMethodForm } from "@/components/organisms/PaymentMethodForm";

export const metadata: Metadata = {
  title: "Complete Your Application — Payment | My Insurance Quoter",
  description: "Finalize payment to submit the application for underwriting.",
};

export default function PaymentPage() {
  return (
    <PaymentPageShell
      currentStep={2}
      footerLinks={[
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Payment Security", href: "#" },
      ]}
    >
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Complete Your Application
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Finalize payment to submit the application for underwriting.
        </p>
      </div>

      {/* Two-column layout:  Order Summary | Payment Form */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <OrderSummaryCard />
        <PaymentMethodForm />
      </div>
    </PaymentPageShell>
  );
}
