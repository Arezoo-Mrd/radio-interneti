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
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "dash.livemst.com",
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: "spr.livemst.com",

            },
        ],
    }
};

export default nextConfig;
