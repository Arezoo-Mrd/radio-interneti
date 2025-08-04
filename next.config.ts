import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    redirects: async () => {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
    images: {
        domains: ['dash.livemst.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "dash.livemst.com",
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: "spr.livemst.com",
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
