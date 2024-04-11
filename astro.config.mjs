import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [myPlugin()],
})

// Will continue working on this later.
function myPlugin() {
  const virtualModuleId = 'virtual:test'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'test',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'test-plugin',
                resolveId(id, importer, options) {
                  console.log('resolve', id)

                  if (id.endsWith('.mp4')) {
                    return '\0' + id
                  }

                  if (id === virtualModuleId) {
                    return resolvedVirtualModuleId
                  }
                },
                load(id) {
                  if (id.endsWith('.mp4')) {
                    console.log('mp4 load', id)
                    return `export default 123`
                  }

                  if (!id.includes('/astro/dist')) {
                    console.log('load', id)
                  }

                  if (id === resolvedVirtualModuleId) {
                    return `export const Message = "from virtual module"`
                  }
                },
              },
            ],
          },
        })
      },
    },
  }
}
