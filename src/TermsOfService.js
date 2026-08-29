import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Terms of Service for Snay3i.ma</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: August 29, 2026</p>

      <p className="mb-6">
        Welcome to <strong>snay3i.ma</strong> (<a href="https://snay3i.ma" className="text-blue-600 underline">https://snay3i.ma</a>). By accessing or using our website, directory services, and artisan registration platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
      <p className="mb-6">
        By accessing snay3i.ma, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use of our website immediately.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
      <p className="mb-6">
        snay3i.ma is an online directory and platform that connects individuals seeking local professional services and craftsmanship with independent artisans across Morocco. We act as an intermediary directory and do not directly provide trade or construction services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Artisan Registration & Profiles</h2>
      <p className="mb-4">
        If you register as an artisan via our onboarding page (<span className="font-mono text-sm bg-gray-100 px-1 py-0.5 rounded">/rejoindre</span>):
      </p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>You agree to provide accurate, current, and complete professional information.</li>
        <li>You are solely responsible for maintaining the accuracy of your profile, phone number, and service category details.</li>
        <li>snay3i.ma reserves the right to review, edit, or remove any artisan listing that violates our community standards or misleads users.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">4. Intellectual Property Rights</h2>
      <p className="mb-6">
        All content, layout, design, text, graphics, blog articles, and source code on snay3i.ma are the property of snay3i.ma and protected under applicable intellectual property laws. You may not copy, reproduce, or redistribute any part of this site without express written consent.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
      <p className="mb-6">
        snay3i.ma provides this directory on an "as is" and "as available" basis. We do not guarantee the quality, safety, legality, or reliability of the services provided by listed artisans. Any agreements, contracts, or financial transactions made between users and artisans are strictly between those parties. snay3i.ma shall not be liable for any direct, indirect, or consequential damages arising from interactions between platform users and listed professionals.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-3">6. Governing Law</h2>
      <p className="mb-6">
        These terms shall be governed by and construed in accordance with the laws of the Kingdom of Morocco, without regard to its conflict of law provisions.
      </p>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          If you have any questions about these Terms of Service, please contact us at: <a href="mailto:contact@snay3i.ma" className="text-blue-600 underline">contact@snay3i.ma</a>
        </p>
      </div>
    </div>
  );
}
