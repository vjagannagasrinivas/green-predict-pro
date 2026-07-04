import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg btn-hero">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">
              Opti<span className="gradient-text">Crop</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Smart agricultural production optimization powered by machine learning
            on soil and climate signals.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-medium text-foreground">Product</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#how" className="hover:text-foreground">How it works</a></li>
            <li><a href="/predict" className="hover:text-foreground">Recommend a crop</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-medium text-foreground">Roadmap</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Yield & market-price prediction</li>
            <li>Disease detection from leaf images</li>
            <li>Live weather & IoT sensor integration</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OptiCrop. Cultivated with care.
      </div>
    </footer>
  );
}
