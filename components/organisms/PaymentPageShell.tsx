import { PaymentNavBar } from "@/components/molecules/PaymentNavBar";
import { StepperNav } from "@/components/molecules/StepperNav";
import { PaymentFooter } from "@/components/molecules/PaymentFooter";

interface PaymentPageShellProps {
  currentStep: number;
  children: React.ReactNode;
  footerLinks?: { label: string; href?: string }[];
}

function PaymentPageShell({
  currentStep,
  children,
  footerLinks,
}: PaymentPageShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] flex flex-col">
      <PaymentNavBar />

      <main className="flex-1 flex flex-col items-center px-4 md:px-8 lg:px-16 pt-8 pb-20">
        <div className="w-full max-w-5xl">
          <StepperNav currentStep={currentStep} className="mb-8" />
          {children}
        </div>
      </main>

      <PaymentFooter links={footerLinks} />
    </div>
  );
}

export { PaymentPageShell };
