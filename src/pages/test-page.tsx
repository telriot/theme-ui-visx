import { NextPage } from 'next';
import Head from 'next/head';
import {
  HorizontalBarChart,
  VerticalBarChart,
} from 'src/components/charts/bar';
import { Box, Flex, Heading } from 'theme-ui';
import { appleStock } from '@visx/mock-data';
import { useMemo } from 'react';
import { formatToMDY } from 'src/utils';
import { BaseDataPoint } from 'src/utils/factories/base-data-point';
import indianPopulation from 'src/assets/indian-population.json';

const TestPage: NextPage = () => {
  const mappedAppleStock = useMemo(
    () =>
      appleStock
        .map((el) => new BaseDataPoint(el.close, formatToMDY(el.date)))
        .slice(0, 300),
    []
  );
  const mappedIndianPopulation = useMemo(
    () =>
      indianPopulation
        .map((el, index) =>
          index % 5 === 0 ? new BaseDataPoint(el.value, el.date) : null
        )
        .filter(Boolean),
    []
  ) as BaseDataPoint[];
  return (
    <>
      <Head>
        <title>Test page</title>
      </Head>
      <Heading mb="3">Chart testing</Heading>
      <Flex py="2" sx={{ flexDirection: 'column' }}>
        <Box mb={4}>
          <HorizontalBarChart
            title="Indian Population Fluctuation"
            data={mappedIndianPopulation}
            height={300}
          />
        </Box>
        <Box mb={4}>
          <VerticalBarChart
            title="Apple Stock Fluctuation"
            data={mappedAppleStock}
            height={300}
          />
        </Box>
      </Flex>
    </>
  );
};

export default TestPage;
