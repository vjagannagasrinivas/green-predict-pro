import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Sparkles, Beaker, Droplets, Thermometer, CloudRain } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { predictCrop, type CropInputs, type Prediction } from "@/lib/crop-predictor";
import { getCropInfo } from "@/lib/crop-info";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Recommend a crop — OptiCrop" },
      {
        name: "description",
        content:
          "Enter your soil and climate data and OptiCrop's ML model recommends the ideal crop with confidence, tips and yield.",
      },
      { property: "og:title", content: "Recommend a crop — OptiCrop" },
    ],
  }),
  component: PredictPage,
});

const inputSchema = z.object({
  N: z.number().min(0).max(200),
  P: z.number().min(0).max(200),
  K: z.number().min(0).max(210),
  temperature: z.number().min(-5).max(55),
  humidity: z.number().min(0).max(100),
  ph: z.number().min(0).max(14),
  rainfall: z.number().min(0).max(400),
});

const DEFAULTS: CropInputs = {
  N: 90, P: 42, K: 43, temperature: 21, humidity: 82, ph: 6.5, rainfall: 203,
};

function PredictPage() {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const [values, setValues] = useState<CropInputs>(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const update = (k: keyof CropInputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value === "" ? 0 : Number(e.target.value);
    setValues((s) => ({ ...s, [k]: Number.isFinite(v) ? v : 0 }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const p = await predictCrop(parsed.data);
      setPrediction(p);
      toast.success(`Recommended: ${getCropInfo(p.crop).name}`);
    } catch (err) {
      toast.error("Prediction failed. Please try again.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setValues(DEFAULTS);
    setPrediction(null);
  };

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main
        className="relative"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_1.1fr]">
          {/* FORM */}
          <section className="glass rounded-3xl p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl btn-hero">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h1 className="font-display text-2xl font-semibold">Crop recommendation</h1>
                <p className="text-sm text-muted-foreground">
                  Enter soil-report values and local climate averages.
                </p>
              </div>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                  id="N" label="Nitrogen (N)" unit="mg/kg" icon={Beaker}
                  min={0} max={200} step={1} value={values.N} onChange={update("N")}
                />
                <Field
                  id="P" label="Phosphorous (P)" unit="mg/kg" icon={Beaker}
                  min={0} max={200} step={1} value={values.P} onChange={update("P")}
                />
                <Field
                  id="K" label="Potassium (K)" unit="mg/kg" icon={Beaker}
                  min={0} max={210} step={1} value={values.K} onChange={update("K")}
                />
                <Field
                  id="temperature" label="Temperature" unit="°C" icon={Thermometer}
                  min={-5} max={55} step={0.1} value={values.temperature} onChange={update("temperature")}
                />
                <Field
                  id="humidity" label="Humidity" unit="%" icon={Droplets}
                  min={0} max={100} step={0.1} value={values.humidity} onChange={update("humidity")}
                />
                <Field
                  id="ph" label="Soil pH" unit="" icon={Beaker}
                  min={0} max={14} step={0.1} value={values.ph} onChange={update("ph")}
                />
                <div className="sm:col-span-3">
                  <Field
                    id="rainfall" label="Rainfall" unit="mm" icon={CloudRain}
                    min={0} max={400} step={1} value={values.rainfall} onChange={update("rainfall")}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" className="btn-hero hover:btn-hero-hover" disabled={busy}>
                  {busy ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Predict crop</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </form>
          </section>

          {/* RESULT */}
          <section>
            {prediction ? (
              <ResultCard prediction={prediction} />
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  id, label, unit, icon: Icon, value, onChange, min, max, step,
}: {
  id: string; label: string; unit: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number; max: number; step: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </Label>
      <div className="relative">
        <Input
          id={id} type="number" inputMode="decimal"
          value={value} onChange={onChange}
          min={min} max={max} step={step}
          className="pr-14"
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass grid h-full min-h-[420px] place-items-center rounded-3xl p-10 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl btn-hero">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl">Your recommendation will appear here</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Fill in your soil report and climate averages, then click <b>Predict crop</b>.
        </p>
      </div>
    </div>
  );
}

function ResultCard({ prediction }: { prediction: Prediction }) {
  const info = getCropInfo(prediction.crop);
  const pct = Math.round(prediction.confidence * 100);
  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Recommended crop
          </div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-4xl">{info.emoji}</span>
            <h2 className="font-display text-4xl font-semibold capitalize gradient-text">
              {info.name}
            </h2>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{info.description}</p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-center">
          <div className="font-display text-3xl text-primary">{pct}%</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            confidence
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Stat label="Suitable season" value={info.season} />
        <Stat label="Soil type" value={info.soil} />
        <Stat label="Water requirement" value={info.water} />
        <Stat label="Expected yield" value={info.yield} />
        <div className="sm:col-span-2">
          <Stat label="Fertilizer plan" value={info.fertilizer} />
        </div>
        <div className="sm:col-span-2">
          <Stat label="Growing tip" value={info.tips} />
        </div>
      </div>

      {prediction.runnerUps.length > 0 && (
        <div className="mt-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Also consider
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {prediction.runnerUps.map((r) => {
              const ri = getCropInfo(r.crop);
              return (
                <span
                  key={r.crop}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs"
                >
                  <span>{ri.emoji}</span>
                  <span className="capitalize">{ri.name}</span>
                  <span className="text-muted-foreground">
                    {Math.round(r.confidence * 100)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 text-[11px] text-muted-foreground">
        Model source: {prediction.source === "api" ? "Flask + scikit-learn API" : "On-device fallback classifier"}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value}</div>
    </div>
  );
}
