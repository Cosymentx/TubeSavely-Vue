<template>
  <div class="relative min-h-screen overflow-x-clip">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <main class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Privacy Policy</h1>

        <div class="space-y-6 text-gray-600 dark:text-gray-300">
          <p>
            This Privacy Policy explains how TubeSavely collects, uses, stores, and protects information when you use our service.
          </p>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">1. Information We Collect</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Account details such as username, email address, and profile information.</li>
              <li>Authentication data needed to sign in, including the provider identifier for social login.</li>
              <li>Service records such as credit balance, payment order status, and download history.</li>
              <li>Technical information needed to secure and operate the service, such as IP address, browser details, and error logs.</li>
            </ul>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">2. How We Use Information</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Provide account access, video processing, credit management, and customer support.</li>
              <li>Process payments through the payment provider you select and prevent fraudulent activity.</li>
              <li>Maintain service security, investigate errors, and improve reliability.</li>
              <li>Comply with applicable legal obligations and enforce our Terms of Use.</li>
            </ul>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">3. Sharing and Retention</h2>
            <p>
              We share information only with service providers needed to operate the service, including authentication, hosting, database, and payment providers, or where required by law. We retain information only for as long as needed for the purposes described here, to resolve disputes, and to meet legal or accounting requirements.
            </p>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">4. Your Choices</h2>
            <p>
              You may request access to, correction of, or deletion of your account information. For account deletion instructions, visit our
              <router-link to="/data-deletion" class="text-[#f32b2b] hover:text-[#ff4b4b] transition-colors font-medium">data deletion page</router-link>.
            </p>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">5. Security</h2>
            <p>
              We use reasonable technical and organizational safeguards to protect information. No internet service or storage system can guarantee absolute security.
            </p>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">6. Updates and Contact</h2>
            <p>
              We may update this policy as the service changes. If you have a privacy question, please contact us through the support page.
            </p>
          </section>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
            <p class="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Last updated:</strong> {{ formattedDate }}
            </p>
          </div>

          <div class="flex justify-center">
            <router-link to="/contact" class="btn-primary">Contact Support</router-link>
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '../components/layout/Navigation.vue'
import BackgroundEffect from '../components/BackgroundEffect.vue'
import Footer from '../components/layout/Footer.vue'

const formattedDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>
