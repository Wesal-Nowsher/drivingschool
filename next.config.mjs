/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // old address of the student guide
      { source: "/v1", destination: "/", permanent: false },
      // instructor page: friendly variants of his name
      { source: "/Yousef%20Ismail%20M.%20Basal", destination: "/yousef-ismail-m-basal", permanent: true },
      { source: "/Yousef Ismail M. Basal", destination: "/yousef-ismail-m-basal", permanent: true },
      { source: "/yousef", destination: "/yousef-ismail-m-basal", permanent: true },
    ];
  },
};
export default nextConfig;
