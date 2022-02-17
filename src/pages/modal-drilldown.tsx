import { NextPage } from 'next';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import { Box } from 'theme-ui';
import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import aircraftDelayData from 'src/assets/airlines.json';
import { Delays } from 'src/assets/types';
import { BaseDataPoint, camelToTitleCase } from 'src/utils';
import { DonutChart } from 'src/components/charts/pie';
import { Modal } from 'src/components/atoms/modal';
import { transparentize } from '@theme-ui/color';

const ModalDrilldownDonut: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleClick = (datum: PieArcDatum<BaseDataPoint>) => {
    console.log(datum);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);
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
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div
          sx={{
            height: '80vh',
            width: '80vw',
            borderRadius: 12,
            bg: transparentize('background', isOpen ? 0 : 1),
            px: 4,
            py: 4,
          }}
        >
          Some modal contents
        </div>
      </Modal>
    </>
  );
};

export default ModalDrilldownDonut;
