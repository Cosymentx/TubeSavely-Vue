<template>
  <div class="relative min-h-screen overflow-hidden">
    <BackgroundEffect />
    
    <div class="relative flex flex-col items-center min-h-screen max-w-4xl mx-auto px-4 py-16">
      <Navigation />

      <div class="w-full backdrop-blur-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/30 rounded-2xl p-8 shadow-lg mt-5">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Contact Us</h1>
        
        <div class="space-y-6">
          <p class="text-gray-600 dark:text-gray-300">
            Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <form class="space-y-6">
            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Name</label>
              <input 
                type="text"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Email</label>
              <input 
                type="email"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-gray-600 dark:text-gray-300 mb-2">Message</label>
              <textarea 
                rows="4"
                class="form-input"
              ></textarea>
            </div>

            <div class="flex justify-center mt-8">
              <button
                type="submit"
                class="btn-primary"
              >
                Send Message
              </button>
            </div>
          </form>
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
</script>