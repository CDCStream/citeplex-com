import type { Metadata } from "next";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://citeplex.com";
const UPDATED = "June 20, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy — CitePlex",
  description:
    "How CitePlex collects, uses, and protects your personal information when you use our citation and academic writing tools.",
  alternates: { canonical: `${BASE}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

          <div className="blog-content mt-10">
            <p>
              CitePlex (&ldquo;CitePlex,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy
              explains what information we collect, how we use it, and the choices you have when
              you use citeplex.com and our citation and academic writing tools (the
              &ldquo;Service&rdquo;).
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>
                <strong>Account information.</strong> When you create an account we collect your
                name, email address, and authentication details. If you sign in with Google, we
                receive your basic Google profile (name, email) via OAuth.
              </li>
              <li>
                <strong>Content you create.</strong> Citations, projects, and other content you
                save are stored so we can provide the Service to you.
              </li>
              <li>
                <strong>Payment information.</strong> Subscriptions are processed by our payments
                provider (Dodo Payments) acting as merchant of record. We do not store your full
                card details; we retain only a customer/subscription reference and plan status.
              </li>
              <li>
                <strong>Usage &amp; device data.</strong> We collect anonymized analytics such as
                pages viewed, approximate location, browser, and device type to improve the
                Service.
              </li>
              <li>
                <strong>Text submitted to tools.</strong> Text you submit to AI, grammar, or
                plagiarism tools is processed to return results and is not used to train our own
                models.
              </li>
            </ul>

            <h2>How we use your information</h2>
            <ul>
              <li>To provide, maintain, and improve the Service.</li>
              <li>To create and manage your account and subscription.</li>
              <li>To send transactional emails (account confirmation, password reset, receipts).</li>
              <li>To monitor performance, prevent abuse, and ensure security.</li>
              <li>To understand usage and improve features and content.</li>
            </ul>

            <h2>Third-party services</h2>
            <p>We rely on trusted providers to operate the Service, including:</p>
            <ul>
              <li><strong>Supabase</strong> — database and authentication.</li>
              <li><strong>Vercel</strong> — hosting and content delivery.</li>
              <li><strong>Dodo Payments</strong> — subscription billing (merchant of record).</li>
              <li><strong>Resend</strong> — transactional email delivery.</li>
              <li><strong>OpenAI</strong> — AI writing features.</li>
              <li><strong>Winston AI</strong> — plagiarism detection.</li>
              <li><strong>Google Analytics &amp; Ahrefs</strong> — anonymized usage analytics.</li>
              <li><strong>Sentry</strong> — error monitoring.</li>
            </ul>
            <p>
              Each provider processes data only as needed to deliver its function and under its own
              privacy and security commitments.
            </p>

            <h2>Cookies &amp; analytics</h2>
            <p>
              We use essential cookies to keep you signed in and analytics cookies to understand
              how the Service is used. You can control cookies through your browser settings;
              disabling some cookies may affect functionality.
            </p>

            <h2>Data retention</h2>
            <p>
              We retain your account and content for as long as your account is active. You may
              delete your content at any time, and you can request deletion of your account by
              contacting us.
            </p>

            <h2>Your rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, export, or
              delete your personal data, and to object to or restrict certain processing. To
              exercise these rights, contact us at the address below.
            </p>

            <h2>Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encryption in
              transit and access controls. No method of transmission or storage is 100% secure, but
              we work to protect your information.
            </p>

            <h2>Children&apos;s privacy</h2>
            <p>
              The Service is not directed to children under 13, and we do not knowingly collect
              personal information from them.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will post the updated version
              on this page and revise the &ldquo;Last updated&rdquo; date above.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions about this Privacy Policy? Email us at{" "}
              <a href="mailto:support@citeplex.com">support@citeplex.com</a>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
