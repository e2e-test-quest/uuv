import { createConfigForNuxt } from '@nuxt/eslint-config';

export default createConfigForNuxt({
    ignores: ['.nuxt/**', '.output/**', 'node_modules'],
})
    .override('nuxt/vue/rules', {
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    });