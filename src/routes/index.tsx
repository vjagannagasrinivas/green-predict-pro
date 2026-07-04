import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sprout, LineChart, Cloud, Droplets, Brain, ShieldCheck } from "lucide-react";
import heroField from "@/assets/hero-field.jpg";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sprout className="h-3.5 w-3.5" /> ML-powered agronomy
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Grow the <span className="gradient-text">right crop</span>,
              <br /> in the right soil.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              OptiCrop reads your soil nutrients and local climate, then
              recommends the crop most likely to thrive — with expected yield,
              fertilizer plan and growing tips.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="btn-hero hover:btn-hero-hover">
                <Link to="/predict">
                  Recommend my crop <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how">See how it works</a>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                { k: "22", v: "crops modeled" },
                { k: "7", v: "input signals" },
                { k: "97%", v: "test accuracy" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-3xl gradient-text">{s.k}</dt>
                  <dd className="text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-primary/20 blur-3xl" aria-hidden />
            <img
              src={heroField}
              alt="Terraced green rice fields at golden hour"
              width={1920}
              height={1280}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-[var(--shadow-glow)]"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            Data-driven decisions, farm-friendly interface
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for smallholders, agronomists and cooperatives who want
            evidence behind every planting decision.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl btn-hero">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-y border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <h2 className="font-display text-4xl font-semibold sm:text-5xl">
                From soil test to sowing plan in seconds.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Enter values from a standard soil report and your regional
                climate averages — OptiCrop scores your inputs against 22 crop
                profiles trained on the Kaggle Crop Recommendation dataset.
              </p>
            </div>
            <ol className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="glass flex gap-4 rounded-2xl p-5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/20 font-display text-lg font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ABOUT / CTA */}
      <section id="about" className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-semibold sm:text-5xl">
          Cultivated by <span className="gradient-text">agronomy + AI</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          OptiCrop ships with a full Python pipeline — Random Forest, SVM, KNN,
          Naive Bayes and more — trained, evaluated and served through a Flask
          REST API. The web app runs on that model, or falls back to an
          on-device classifier so you can try it right now.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="btn-hero hover:btn-hero-hover">
            <Link to="/predict">
              Get my recommendation <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/auth">Create an account</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const FEATURES = [
  {
    icon: Brain,
    title: "ML crop matching",
    body: "Random Forest classifier compares your 7 inputs against 22 crop profiles and returns the best fit with a confidence score.",
  },
  {
    icon: Droplets,
    title: "Water & fertilizer plan",
    body: "Every recommendation ships with irrigation depth, N-P-K schedule and growing-stage advice.",
  },
  {
    icon: LineChart,
    title: "Expected yield",
    body: "Get realistic yield ranges (t/ha) alongside the season best suited to the recommended crop.",
  },
  {
    icon: Cloud,
    title: "Climate-aware",
    body: "Temperature, humidity and rainfall weigh heavily — so semi-arid and humid regions get very different suggestions.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    body: "Your soil data stays in your account. Authenticate with email and pick up where you left off from any device.",
  },
  {
    icon: Sprout,
    title: "Ready to extend",
    body: "Architecture is future-ready for disease detection, market prices, weather APIs and IoT sensor integration.",
  },
];

const STEPS = [
  {
    title: "Enter soil & climate",
    body: "N, P, K in mg/kg from a soil report, plus average temperature (°C), humidity (%), pH and rainfall (mm).",
  },
  {
    title: "The model scores 22 crops",
    body: "A trained Random Forest ranks each crop by how well your inputs fit its ideal range.",
  },
  {
    title: "Get a full sowing plan",
    body: "See the recommended crop, confidence, season, soil type, water/fertilizer plan, tips and expected yield.",
  },
];
