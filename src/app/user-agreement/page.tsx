export default function UserAgreementPage() {
  return <LegalPage title="User Agreement" updated="26 August 2026">
    <p>By creating or using a Flint.ai account, you agree to use the service lawfully and responsibly.</p>
    <h2>1. Your account</h2><p>You are responsible for keeping your account credentials secure and for activity performed through your account. Do not create accounts to abuse, overload, scrape, reverse engineer, or disrupt Flint.ai.</p>
    <h2>2. AI-generated content</h2><p>Flint.ai provides career guidance, resume feedback, LinkedIn suggestions and career pathways generated with AI. AI output can be incomplete, outdated, or incorrect. You are responsible for reviewing suggestions before relying on them for employment, education, immigration, compensation, or other decisions.</p>
    <h2>3. Payments and access</h2><p>Some AI generations may be available through one-time purchases and Premium may provide unlimited access for a defined paid period. Prices and included features are shown before payment. Access is granted only after payment is confirmed by our payment provider.</p>
    <h2>4. Acceptable use</h2><p>You may not use Flint.ai to generate unlawful content, attack the service, circumvent access controls, abuse payment systems, or intentionally submit automated traffic designed to consume disproportionate resources.</p>
    <h2>5. Service availability</h2><p>Flint.ai is provided on an evolving basis. Features, models, limits and availability may change as the product develops.</p>
    <h2>6. Intellectual property</h2><p>You retain rights to content you submit, subject to the rights required to operate the service. Flint.ai branding, software and interface remain the property of their respective owners.</p>
    <h2>7. Contact</h2><p>Questions about these terms can be sent through the support channel provided in Flint.ai.</p>
  </LegalPage>;
}

function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) { return <main className="mx-auto max-w-3xl px-5 pb-24 pt-28"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Flint.ai legal</p><h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1><p className="mt-2 text-xs text-muted-foreground">Last updated {updated}</p><article className="prose prose-invert mt-10 max-w-none prose-headings:mt-8 prose-p:text-muted-foreground">{children}</article></main>; }
