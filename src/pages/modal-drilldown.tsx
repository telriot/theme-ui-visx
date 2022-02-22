import { NextPage } from 'next';
import { useMemo, useState, useCallback } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import aircraftDelayData from 'src/assets/airlines.json';
import { Delays, NumberOfDelays } from 'src/assets/types';
import { BaseDataPoint, camelToTitleCase } from 'src/utils';
import { DonutChart } from 'src/components/charts/pie';
import { VerticalBarChart } from 'src/components/charts/bar';
import { Modal } from 'src/components/atoms/modal';
import { transparentize } from '@theme-ui/color';

export type TFlightStatus = 'cancelled' | 'delayed' | 'diverted' | 'onTime';
const ModalDrilldownDonut: NextPage = () => {
  const [selected, setSelected] = useState<TFlightStatus | null>(null);
  const airports = useMemo(
    () =>
      Array.from(
        new Set(
          (aircraftDelayData as Delays[]).map((entry) => entry.airport.code)
        )
      ),
    []
  );
  const currentDataset = useMemo(() => {
    if (!airports.length) return [];
    return (aircraftDelayData as Delays[]).slice(0, airports.length);
  }, [airports]);

  const mappedFlightStatuses = useMemo(() => {
    const statuses: Record<string, number> = {};
    currentDataset?.forEach((el: Delays) => {
      Object.entries(el.statistics.flights).forEach(([key, value]) => {
        if (key === 'total') return;
        if (!statuses[key]) statuses[key] = 0;
        statuses[key] += value;
      });
    });
    return Object.entries(statuses).map(
      ([key, value]) => new BaseDataPoint(value, camelToTitleCase(key))
    );
  }, [currentDataset]);

  const getStatusByAirport = useCallback(
    (status: TFlightStatus) =>
      airports
        .map((airport) => {
          const value = currentDataset?.find(
            (entry) => entry.airport.code === airport
          )?.statistics.flights[status];
          if (!value) return null;
          return new BaseDataPoint(value, airport);
        })
        .filter(Boolean) as BaseDataPoint[],
    [currentDataset, airports]
  );

  const drilldownData: Record<TFlightStatus, BaseDataPoint[]> = useMemo(
    () => ({
      delayed: getStatusByAirport('delayed'),
      diverted: getStatusByAirport('diverted'),
      cancelled: getStatusByAirport('cancelled'),
      onTime: getStatusByAirport('onTime'),
    }),
    [getStatusByAirport]
  );

  console.log(drilldownData);

  const handleClick = (datum: PieArcDatum<BaseDataPoint>) => {
    const getTarget = (label: string) => {
      switch (label) {
        case 'On Time':
          return 'onTime';
        case 'Cancelled':
          return 'cancelled';
        case 'Diverted':
          return 'diverted';
        case 'Delayed':
          return 'delayed';
        default:
          return null;
      }
    };
    setSelected(getTarget(datum.data.label));
  };

  const handleClose = () => setSelected(null);
  return (
    <>
      <Head>
        <title>Modal Drilldown Donut</title>
      </Head>
      <Box mb={4} sx={{ flex: 1 }}>
        <DonutChart
          title="Flight status at arrival"
          data={mappedFlightStatuses}
          height={600}
          thickness={150}
          onClickDatum={handleClick}
        />
      </Box>
      <Modal isOpen={Boolean(selected)} onClose={handleClose}>
        <div
          sx={{
            height: '80vh',
            width: '80vw',
            borderRadius: 12,
            bg: transparentize('background', selected ? 0 : 1),
            px: 4,
            py: 4,
          }}
        >
          {selected && (
            <Box mb={4} sx={{ height: '100%' }}>
              <VerticalBarChart
                title={`${camelToTitleCase(selected)} by airport`}
                data={drilldownData[selected]}
              />
            </Box>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalDrilldownDonut;
