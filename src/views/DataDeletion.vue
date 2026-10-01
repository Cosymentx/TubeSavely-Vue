<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />

    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <main class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">Data Deletion Instructions</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          You can request deletion of your TubeSavely account and associated personal data at any time.
        </p>

        <div class="space-y-6 text-gray-600 dark:text-gray-300">
          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">How to Request Deletion</h2>
            <ol class="list-decimal list-inside space-y-3">
              <li>Sign in to the account you want to delete, if you can access it.</li>
              <li>Open the support page and select the account or data deletion request.</li>
              <li>Use the email address associated with your account and include your username.</li>
              <li>We may ask you to verify account ownership before processing the request.</li>
            </ol>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">What Will Be Deleted</h2>
            <ul class="list-disc list-inside space-y-2">
              <li>Your account profile and authentication identifiers.</li>
              <li>Your stored preferences and account-linked download history.</li>
              <li>Personal information that is no longer required for security, legal, or accounting purposes.</li>
            </ul>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Information We May Retain</h2>
            <p>
              We may retain limited transaction, fraud-prevention, and compliance records where required by law or needed to resolve a dispute. Retained records are restricted to those purposes and are not used to restore your account.
            </p>
          </section>

          <section class="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Request Status</h2>
            <p>
              We will confirm receipt of your request and notify you after it has been completed or if additional verification is needed.
            </p>
          </section>

          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
            <p class="text-yellow-800 dark:text-yellow-200 text-sm">
              This page is the public data deletion URL for TubeSavely. Last updated: {{ formattedDate }}
            </p>
          </div>

          <div class="flex justify-center">
            <router-link to="/contact" class="btn-primary">Request Data Deletion</router-link>
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
