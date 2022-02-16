const withMDX = require('@next/mdx')();

module.exports = withMDX({
  pageExtensions: ['js', 'mdx', 'tsx'],
  eslint: {
    dirs: ['pages', 'utils', 'hooks', 'utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  },
});
