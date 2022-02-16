import React, { FC, useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { animated, useTransition, interpolate } from 'react-spring';

export interface DonutChartProps {
  className?: string;
}
export const DonutChart : FC<DonutChartProps> = ({className}) => {
    return (
        <div>
        </div>
    )
}
 