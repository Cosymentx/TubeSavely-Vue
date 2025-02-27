<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Terms and Ethics of Use</h1>
        
        <div class="space-y-6">
          <p class="text-gray-600 dark:text-gray-300">
            Welcome to TubeSavely. By using our service, you agree to comply with and be bound by the following terms and conditions:
          </p>

          <div class="space-y-4">
            <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">1. Usage Guidelines</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>You will not use this service for any illegal purposes or activities</li>
                <li>You will respect copyright and intellectual property rights of content creators</li>
                <li>You will not abuse, hack, or attempt to overload our service</li>
                <li>You understand that we are not responsible for the content you download</li>
                <li>You agree to use the service in compliance with all applicable laws</li>
                <li>You will not use automated scripts or bots to access the service</li>
              </ul>
            </div>

            <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">2. Privacy & Security</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>We do not store your downloaded content on our servers</li>
                <li>We respect your privacy and do not track your download history</li>
                <li>We use industry-standard encryption to protect your data</li>
                <li>We do not share your personal information with third parties</li>
                <li>We may collect anonymous usage statistics to improve our service</li>
                <li>You can request deletion of your account data at any time</li>
              </ul>
            </div>

            <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">3. Fair Use Policy</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Only download content that you have the right to access</li>
                <li>Use downloaded content in accordance with applicable laws</li>
                <li>Do not distribute copyrighted material without permission</li>
                <li>Respect content creators and their intellectual property rights</li>
                <li>Use downloaded content for personal, non-commercial purposes only</li>
                <li>Report any misuse or abuse of the service that you encounter</li>
              </ul>
            </div>

            <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">4. Service Limitations</h2>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>We reserve the right to limit download speeds or bandwidth</li>
                <li>Service availability may vary based on your location</li>
                <li>Some features may require a registered account</li>
                <li>We may modify or discontinue services without prior notice</li>
                <li>Download quality depends on the source material</li>
                <li>Certain content may be unavailable due to regional restrictions</li>
              </ul>
            </div>

            <div class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">5. Updates and Changes</h2>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                We reserve the right to update these terms at any time. Significant changes will be notified to users via:
              </p>
              <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Email notifications for registered users</li>
                <li>Website announcements</li>
                <li>In-app notifications</li>
                <li>Updates to this terms page</li>
              </ul>
            </div>
          </div>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg mt-8">
            <p class="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Note:</strong> These terms are subject to change. Last updated: {{ formattedDate }}
            </p>
          </div>

          <div class="flex justify-center mt-8">
            <router-link 
              to="/contact" 
              class="btn-primary"
            >
              Contact Support
            </router-link>
          </div>
        </div>
      </div>
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