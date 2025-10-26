import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-routes',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            try {
              const url = new URL(req.url, `http://${req.headers.host}`)
              const pathname = url.pathname.replace('/api', '')
              
              let handler
              const apiDir = path.join(__dirname, 'api-server')
              
              if (pathname === '/prompts') {
                handler = await import(pathToFileURL(path.join(apiDir, 'prompts/route.js')).href)
              } else if (pathname === '/statistics') {
                handler = await import(pathToFileURL(path.join(apiDir, 'statistics/route.js')).href)
              } else if (pathname === '/categories') {
                handler = await import(pathToFileURL(path.join(apiDir, 'categories/route.js')).href)
              } else {
                res.statusCode = 404
                res.end(JSON.stringify({ error: 'API route not found' }))
                return
              }
              
              const request = new Request(url.href, {
                method: req.method,
                headers: req.headers as HeadersInit
              })
              
              const response = await handler.GET(request)
              const data = await response.json()
              
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            } catch (error) {
              console.error('API handler error:', error)
              res.statusCode = 500
              res.end(JSON.stringify({ error: error.message || 'Internal server error' }))
            }
          } else {
            next()
          }
        })
      }
    }
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
})

function pathToFileURL(filePath) {
  return new URL('file:///' + path.resolve(filePath).replace(/\\/g, '/'))
}
