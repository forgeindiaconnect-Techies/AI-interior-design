import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1F2937] mb-4 pb-2 border-b border-[#D4A373]/30">
      {title}
    </h2>
    <div className="text-[#6B7280] text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsOfService = () => {
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
              <FileText className="w-6 h-6 text-[#D4A373]" />
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-extrabold">Terms of Service</h1>
          </div>
          <p className="text-gray-300 text-sm">Last updated: May 22, 2026 &nbsp;|&nbsp; Effective immediately</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-3xl shadow-md border border-[#D4A373]/20 p-10">

          <p className="text-[#6B7280] text-sm leading-relaxed mb-10">
            Please read these Terms of Service carefully before using <strong className="text-[#1F2937]">ArtisanStudio</strong>. By accessing or using our platform, you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>By creating an account or using any part of the ArtisanStudio platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. These terms apply to all users, including customers, vendors, manufacturers, delivery partners, and installation experts.</p>
          </Section>

          <Section title="2. Description of Services">
            <p>ArtisanStudio provides an AI-powered interior design and marketplace platform that includes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>AI-generated interior design suggestions based on uploaded room photos</li>
              <li>A curated marketplace for premium furniture and décor products</li>
              <li>Custom furniture manufacturing facilitated through verified partner manufacturers</li>
              <li>Managed delivery and white-glove installation services</li>
              <li>A partner network portal for vendors, manufacturers, delivery, and installation businesses</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <p>To access most features, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and not share it with third parties</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
          </Section>

          <Section title="4. Platform Use & Prohibited Conduct">
            <p>You agree not to use ArtisanStudio to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Upload illegal, obscene, defamatory, or infringing content</li>
              <li>Attempt to hack, reverse-engineer, or disrupt the platform</li>
              <li>Submit false or misleading product listings, reviews, or quotations</li>
              <li>Harass, threaten, or abuse other users or platform staff</li>
              <li>Use automated bots or scrapers without prior written permission</li>
              <li>Engage in money laundering or fraudulent transactions</li>
            </ul>
          </Section>

          <Section title="5. AI Design Services">
            <p>Our AI design tool generates interior suggestions based on your uploaded photos and preferences. Please note:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>AI-generated designs are suggestions and not guaranteed to be architecturally accurate</li>
              <li>Actual product colors, textures, and dimensions may vary from AI renders</li>
              <li>You retain ownership of photos you upload; by uploading, you grant us a limited license to process them for design generation</li>
              <li>We do not guarantee specific design outcomes; results depend on image quality and input clarity</li>
            </ul>
          </Section>

          <Section title="6. Orders, Payments & Refunds">
            <p>All purchases and custom manufacturing orders are subject to the following:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Prices are listed in USD and may be subject to applicable taxes</li>
              <li>Payment must be completed before order processing begins</li>
              <li>Custom-made furniture orders are non-refundable once production has commenced</li>
              <li>Ready-made marketplace orders may be returned within 14 days if unused and in original packaging</li>
              <li>Refunds are processed to the original payment method within 7–10 business days</li>
              <li>Shipping fees are non-refundable unless the return is due to our error or product defect</li>
            </ul>
          </Section>

          <Section title="7. Vendor & Partner Terms">
            <p>Partners joining the ArtisanStudio network (vendors, manufacturers, delivery, installation) agree to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide accurate business credentials and undergo our verification process</li>
              <li>List only genuine products or services with correct specifications and pricing</li>
              <li>Fulfill orders, quotations, and delivery commitments within stated timelines</li>
              <li>Maintain a minimum customer satisfaction rating as determined by platform policy</li>
              <li>Pay applicable platform commissions or subscription fees as per the partner agreement</li>
              <li>ArtisanStudio reserves the right to remove partners who fail to meet quality standards</li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All platform content including the ArtisanStudio name, logo, AI engine, interface designs, and documentation are owned by ArtisanStudio Inc. and protected by intellectual property laws. You may not:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Copy, modify, or redistribute any platform content without permission</li>
              <li>Use our branding or trademarks without written consent</li>
              <li>Claim ownership of AI-generated designs produced by our engine</li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by law, ArtisanStudio shall not be liable for:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Indirect, incidental, or consequential damages arising from platform use</li>
              <li>Delays, defects, or disputes arising from vendor or manufacturer fulfillment</li>
              <li>Loss of data due to circumstances beyond our reasonable control</li>
              <li>Decisions made by users based on AI-generated design suggestions</li>
            </ul>
            <p className="mt-3">Our total liability shall not exceed the amount you paid to ArtisanStudio in the 12 months preceding the claim.</p>
          </Section>

          <Section title="10. Dispute Resolution">
            <p>In the event of a dispute arising from these Terms, both parties agree to first attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in New York, NY, under applicable commercial arbitration rules. Class action lawsuits are expressly waived.</p>
          </Section>

          <Section title="11. Modifications to Terms">
            <p>We reserve the right to update these Terms of Service at any time. Material changes will be communicated via email or platform notifications with at least 14 days' notice. Continued use after the effective date constitutes acceptance of the updated terms.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These Terms are governed by the laws of the State of New York, United States, without regard to conflict of law principles.</p>
          </Section>

          <Section title="13. Contact">
            <p>For questions about these Terms of Service, contact us:</p>
            <div className="mt-3 p-4 bg-[#F8F5F0] rounded-xl border border-[#D4A373]/30 space-y-1">
              <p><strong className="text-[#1F2937]">Email:</strong> <a href="mailto:support@artisanstudio.com" className="text-[#8B5E3C] hover:underline">support@artisanstudio.com</a></p>
              <p><strong className="text-[#1F2937]">Phone:</strong> +1 (555) 123-4567</p>
              <p><strong className="text-[#1F2937]">Address:</strong> ArtisanStudio Inc., 400 Luxury Avenue, New York, NY 10001</p>
            </div>
          </Section>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link to="/privacy-policy" className="text-[#8B5E3C] hover:underline font-medium text-sm">
              Read our Privacy Policy →
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

export default TermsOfService;
