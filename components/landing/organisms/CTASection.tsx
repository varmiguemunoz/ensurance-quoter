import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-10 overflow-hidden">
            {/* Subtle brand background tint */}
            <div className="absolute inset-0 bg-brand/5" aria-hidden="true" />

            <div className="relative mx-auto max-w-3xl text-center flex flex-col items-center gap-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                    Ready to modernize your sales workflow?
                </h2>

                <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl">
                    Join thousands of agents using the Command Center to close more deals
                    with less friction.
                </p>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <Button
                        size="lg"
                        className="bg-brand text-white font-black text-xl rounded-lg px-10 py-6 shadow-[0px_25px_50px_-12px_rgba(23,115,207,0.4)] hover:bg-brand/90"
                    >
                        Request Access Now
                    </Button>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        No Credit Card Required
                    </p>
                </div>
            </div>
        </section>
    );
}
