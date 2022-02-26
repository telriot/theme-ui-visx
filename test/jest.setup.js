import '@testing-library/jest-dom/extend-expect';
import { matchers } from '@emotion/jest';

expect.extend(matchers);
global.ResizeObserver = require('resize-observer-polyfill');
