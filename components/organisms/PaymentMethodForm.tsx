"use client";

import { useState } from "react";
import {
  PaymentMethodTab,
  type PaymentMethod,
} from "@/components/atoms/PaymentMethodTab";
import { Lock, HelpCircle } from "lucide-react";

function PaymentMethodForm() {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("card");

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-8 lg:p-9 flex-1 space-y-6">
      {/* Heading */}
      <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded max-w-md flex">
        <PaymentMethodTab
          method="card"
          isActive={activeMethod === "card"}
          onClick={() => setActiveMethod("card")}
        />
        <PaymentMethodTab
          method="ach"
          isActive={activeMethod === "ach"}
          onClick={() => setActiveMethod("ach")}
        />
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Name on Card */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Name on Card
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-slate-300 rounded py-3 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1773cf]/30 focus:border-[#1773cf] transition-colors"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full border border-slate-300 rounded py-3 px-3.5 pr-24 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1773cf]/30 focus:border-[#1773cf] transition-colors"
              />
              {/* Card brand placeholders */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <div className="bg-slate-200 rounded-sm w-9 h-5" />
                <div className="bg-slate-200 rounded-sm w-9 h-5" />
              </div>
            </div>
          </div>

          {/* Expiration / CVC / Zip Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Expiration Date
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full border border-slate-300 rounded py-3 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1773cf]/30 focus:border-[#1773cf] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                CVC / CVV
                <HelpCircle className="size-3.5 text-slate-400" />
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full border border-slate-300 rounded py-3 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1773cf]/30 focus:border-[#1773cf] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Zip Code
              </label>
              <input
                type="text"
                placeholder="10001"
                className="w-full border border-slate-300 rounded py-3 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1773cf]/30 focus:border-[#1773cf] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Authorization checkbox */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="authorize"
              className="mt-1 rounded-sm border-slate-300 size-4 shrink-0"
            />
            <label
              htmlFor="authorize"
              className="text-sm leading-relaxed space-y-1"
            >
              <p className="text-slate-700 font-medium">
                I authorize the initial payment of{" "}
                <strong className="font-bold">$92.15</strong> today.
              </p>
              <p className="text-slate-500">
                I understand that future payments of $42.15 will be charged
                monthly. By checking this box, I agree to the{" "}
                <a href="#" className="text-[#1773cf] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#1773cf] hover:underline">
                  Automatic Payment Agreement
                </a>
                .
              </p>
            </label>
          </div>
        </div>

        {/* Bottom bar: card brands + submit */}
        <div className="flex items-center justify-between pt-2">
          {/* Card brand + SSL */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="bg-slate-200 rounded-sm w-11 h-6" />
            <div className="bg-slate-200 rounded-sm w-11 h-6" />
            <div className="bg-slate-200 rounded-sm w-11 h-6" />
            <div className="border border-slate-300 rounded-sm px-1.5 py-0.5 flex items-center gap-1">
              <Lock className="size-3 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">
                SSL SECURE
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            className="bg-[#1773cf] text-white font-semibold text-base rounded px-9 py-3.5 flex items-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#1565b8] transition-colors"
          >
            <Lock className="size-4" />
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export { PaymentMethodForm };
