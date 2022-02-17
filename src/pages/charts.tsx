import { NextPage } from 'next';
import { useMemo } from 'react';
import Head from 'next/head';
import {
  HorizontalBarChart,
  VerticalBarChart,
} from 'src/components/charts/bar';
import { Box, Flex, Grid, Heading } from 'theme-ui';
import { appleStock } from '@visx/mock-data';
import { camelToTitleCase, formatToMDY } from 'src/utils';
import { BaseDataPoint } from 'src/utils/factories/base-data-point';
import indianPopulation from 'src/assets/indian-population.json';
import aircraftDelayData from 'src/assets/airlines.json';
import { PieChart, DonutChart } from 'src/components/charts/pie';
import { Delays } from 'src/assets/types';

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
  const mappedDelayCauses = useMemo(() => {
    const causes: Record<string, number> = {};
    (aircraftDelayData as Delays[]).slice(0, 10).forEach((el: Delays) => {
      Object.entries(el.statistics.delays).forEach(([key, value]) => {
        if (!causes[key]) causes[key] = 0;
        causes[key] += value;
      });
    });
    return Object.entries(causes).map(
      ([key, value]) => new BaseDataPoint(value, camelToTitleCase(key))
    );
  }, []);

  const mappedFlightStatuses = useMemo(() => {
    const statuses: Record<string, number> = {};
    (aircraftDelayData as Delays[]).slice(0, 10).forEach((el: Delays) => {
      Object.entries(el.statistics.flights).forEach(([key, value]) => {
        if (key === 'total') return;
        if (!statuses[key]) statuses[key] = 0;
        statuses[key] += value;
      });
    });
    return Object.entries(statuses).map(
      ([key, value]) => new BaseDataPoint(value, camelToTitleCase(key))
    );
  }, []);

  return (
    <>
      <Head>
        <title>Test page</title>
      </Head>
      <Heading mb="3">Chart testing</Heading>
      <Flex py="2" sx={{ flexDirection: 'column' }}>
        <Grid gap={4} columns={[2]}>
          <Box mb={4} sx={{ flex: 1 }}>
            <DonutChart
              title="Flight status at arrival"
              data={mappedFlightStatuses}
              height={400}
              thickness={60}
            />
          </Box>
          <Box mb={4} sx={{ flex: 1 }}>
            <PieChart
              title="Aircraft delay causes"
              data={mappedDelayCauses}
              height={400}
            />
          </Box>
        </Grid>

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
