import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937] mb-4 pb-2 border-b border-[#D4A373]/30">
      {title}
    </h2>
    <div className="text-[#6B7280] text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Header */}
      <div className="bg-[#2F3E46] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A373] hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#D4A373]" />
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-extrabold">Privacy Policy</h1>
          </div>
          <p className="text-gray-300 text-sm">Last updated: May 22, 2026 &nbsp;|&nbsp; Effective immediately</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-3xl shadow-md border border-[#D4A373]/20 p-10">

          <p className="text-[#6B7280] text-sm leading-relaxed mb-10">
            Welcome to <strong className="text-[#1F2937]">ArtisanStudio</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered interior design platform.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Create an account (name, email address, phone number, address)</li>
              <li>Upload room photos for AI interior design analysis</li>
              <li>Place orders or request custom furniture manufacturing</li>
              <li>Register as a vendor, manufacturer, delivery, or installation partner</li>
              <li>Contact us via our support or contact forms</li>
            </ul>
            <p className="mt-3">We also automatically collect usage data including IP address, browser type, pages visited, and time spent on the platform.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide, operate, and improve our AI interior design services</li>
              <li>Process your orders and coordinate with vendors, manufacturers, and delivery partners</li>
              <li>Send transactional emails such as order confirmations and status updates</li>
              <li>Personalize your experience and recommend products</li>
              <li>Monitor and analyze usage trends to improve platform performance</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </Section>

          <Section title="3. Room Photos & AI Processing">
            <p>When you upload room photos for AI design generation:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Photos are processed by our AI engine solely to generate interior design suggestions</li>
              <li>Photos are stored securely and are not shared with third parties without your consent</li>
              <li>You may delete your uploaded photos at any time from your dashboard</li>
              <li>We do not use your photos to train third-party AI models without explicit consent</li>
            </ul>
          </Section>

          <Section title="4. Sharing of Information">
            <p>We do not sell, trade, or rent your personal data. We may share your information with:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[#1F2937]">Vendors & Manufacturers:</strong> Order details required to fulfill your custom furniture requests</li>
              <li><strong className="text-[#1F2937]">Delivery Partners:</strong> Shipping address and order information for logistics</li>
              <li><strong className="text-[#1F2937]">Payment Processors:</strong> Billing details via encrypted, PCI-compliant payment gateways</li>
              <li><strong className="text-[#1F2937]">Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>All data is encrypted in transit using TLS/SSL protocols</li>
              <li>Passwords are hashed using bcrypt and never stored in plain text</li>
              <li>Access to personal data is restricted to authorized personnel only</li>
              <li>Regular security audits and penetration testing are performed</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            <p>We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings via your browser preferences. Types of cookies we use:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-[#1F2937]">Essential cookies:</strong> Required for authentication and platform functionality</li>
              <li><strong className="text-[#1F2937]">Analytics cookies:</strong> Help us understand how users interact with our platform</li>
              <li><strong className="text-[#1F2937]">Preference cookies:</strong> Remember your settings and personalization choices</li>
            </ul>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access, update, or delete your personal information at any time</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of data we hold about you</li>
              <li>Withdraw consent for data processing where consent is the legal basis</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:support@artisanstudio.com" className="text-[#8B5E3C] hover:underline font-medium">support@artisanstudio.com</a>.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain your personal data only for as long as necessary to provide services or as required by law. Account data is retained for the duration of your active account. Deleted account data is purged within 30 days of deletion request.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of ArtisanStudio after changes take effect constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-4 bg-[#F8F5F0] rounded-xl border border-[#D4A373]/30 space-y-1">
              <p><strong className="text-[#1F2937]">Email:</strong> <a href="mailto:support@artisanstudio.com" className="text-[#8B5E3C] hover:underline">support@artisanstudio.com</a></p>
              <p><strong className="text-[#1F2937]">Phone:</strong> +1 (555) 123-4567</p>
              <p><strong className="text-[#1F2937]">Address:</strong> ArtisanStudio Inc., 400 Luxury Avenue, New York, NY 10001</p>
            </div>
          </Section>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link to="/terms-of-service" className="text-[#8B5E3C] hover:underline font-medium text-sm">
              Read our Terms of Service →
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
