/** @type {import('react-doctor').Config} */
const config = {
  ignore: {
    files: [
      "src/components/ui/**",
      "doctor.config.mjs",
      "src/hooks/use-mobile.ts",
      "src/lib/supabase/**",
      "src/proxy.ts",
      ".next/**",
      ".agents/**",
    ],
  },
};

export default config;
