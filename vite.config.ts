import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, renameSync } from 'fs'

// Plugin para copiar manifest.json e reorganizar HTMLs
const setupExtensionAssets = () => ({
  name: 'setup-extension-assets',
  closeBundle() {
    try {
      // Copiar manifest
      mkdirSync('dist', { recursive: true })
      copyFileSync('public/manifest.json', 'dist/manifest.json')
      console.log('✅ manifest.json copiado para dist/')
      
      // Mover HTMLs para raiz
      const pages = ['popup', 'sidepanel', 'options']
      pages.forEach(page => {
        const source = `dist/src/pages/${page}/index.html`
        const dest = `dist/${page}.html`
        try {
          renameSync(source, dest)
          console.log(`✅ ${page}.html movido para raiz do dist/`)
        } catch (error) {
          console.warn(`⚠️ Não foi possível mover ${page}.html:`, error)
        }
      })
      
      // Mover callback.html para raiz
      try {
        const callbackSource = 'dist/src/pages/auth/callback.html'
        const callbackDest = 'dist/auth/callback.html'
        mkdirSync('dist/auth', { recursive: true })
        renameSync(callbackSource, callbackDest)
        console.log('✅ auth/callback.html movido para dist/auth/')
      } catch (error) {
        console.warn('⚠️ Não foi possível mover callback.html:', error)
      }
    } catch (error) {
      console.error('❌ Erro ao configurar assets:', error)
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), setupExtensionAssets()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        // Páginas principais
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
        sidepanel: resolve(__dirname, 'src/pages/sidepanel/index.html'),
        options: resolve(__dirname, 'src/pages/options/index.html'),
        // Página de autenticação
        callback: resolve(__dirname, 'src/pages/auth/callback.html'),
        // Scripts
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
        'auth-callback': resolve(__dirname, 'src/pages/auth/callback.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Scripts vão para a pasta raiz do dist
          if (['background', 'content'].includes(chunkInfo.name)) {
            return '[name].js'
          }
          // Demais assets vão para assets/
          return 'assets/[name].js'
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // HTML files mantém estrutura original (serão movidos pelo plugin)
          if (assetInfo.name?.endsWith('.html')) {
            return '[name].[ext]'
          }
          return 'assets/[name].[ext]'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
