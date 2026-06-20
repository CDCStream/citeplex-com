import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";
const UPDATED = "June 20, 2026";

export const metadata: Metadata = {
  title: "Terms of Service — CitePlex",
  description:
    "The terms and conditions that govern your use of CitePlex's citation and academic writing tools.",
  alternates: { canonical: `${BASE}/terms` },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

          <div className="blog-content mt-10">
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
              citeplex.com and the CitePlex citation and academic writing tools (the
              &ldquo;Service&rdquo;). By using the Service, you agree to these Terms. If you do not
              agree, please do not use the Service.
            </p>

            <h2>The Service</h2>
            <p>
              CitePlex provides citation generation, reference management, and AI-assisted writing
              tools. Citations are generated using rule-based formatting and AI; while we strive for
              accuracy, you are responsible for reviewing all output before submission.
            </p>

            <h2>Accounts</h2>
            <p>
              You must provide accurate information when creating an account and keep your
              credentials secure. You are responsible for activity that occurs under your account.
              You must be at least 13 years old to use the Service.
            </p>

            <h2>Acceptable use</h2>
            <ul>
              <li>Do not use the Service for unlawful, infringing, or abusive purposes.</li>
              <li>Do not attempt to disrupt, reverse-engineer, or gain unauthorized access to the Service.</li>
              <li>Do not resell or redistribute the Service without our written permission.</li>
              <li>Do not submit content you do not have the right to use.</li>
            </ul>

            <h2>Subscriptions, billing &amp; refunds</h2>
            <ul>
              <li>
                Paid plans are billed on a recurring basis (monthly or annually) through our
                payments provider, Dodo Payments, acting as merchant of record.
              </li>
              <li>
                Your subscription renews automatically until cancelled. You can cancel at any time
                from your dashboard; access continues until the end of the current billing period.
              </li>
              <li>
                Fees are non-refundable except where required by law. If you believe you were
                charged in error, contact us and we will review your request.
              </li>
              <li>Prices may change; we will give notice of changes before they take effect.</li>
            </ul>

            <h2>Free tier</h2>
            <p>
              Generating and copying citations is free. Some features (such as exporting, unlimited
              saving, and full plagiarism scans) require a paid plan. We may apply reasonable usage
              limits to free features to prevent abuse and manage costs.
            </p>

            <h2>Your content</h2>
            <p>
              You retain ownership of the content you submit. You grant us a limited license to
              process and store that content solely to provide the Service to you.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The Service, including its software, design, and branding, is owned by CitePlex and
              protected by intellectual property laws. These Terms do not grant you any rights to
              our trademarks or other brand features.
            </p>

            <h2>Disclaimers</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
              guarantee that citations or AI output are error-free or suitable for a particular
              purpose. Always verify citations against the relevant style guide before submission.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, CitePlex will not be liable for any indirect,
              incidental, or consequential damages, or for any loss of data, arising from your use
              of the Service. Our total liability is limited to the amount you paid us in the twelve
              months preceding the claim.
            </p>

            <h2>Termination</h2>
            <p>
              You may stop using the Service at any time. We may suspend or terminate access if you
              violate these Terms or use the Service in a way that could harm us or other users.
            </p>

            <h2>Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. We will post the updated version on this
              page and revise the &ldquo;Last updated&rdquo; date above. Continued use of the
              Service after changes constitutes acceptance of the updated Terms.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about these Terms? Email us at{" "}
              <a href="mailto:support@citeplex.com">support@citeplex.com</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
