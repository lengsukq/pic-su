/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        runtime: process.env.RUNTIME
    },
    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    }

};

module.exports = nextConfig