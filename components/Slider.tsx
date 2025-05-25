"use client";

import * as RadixSlider from '@radix-ui/react-slider';

interface SliderProps {
    value?: number[];
    onValueChange?: (value: number[]) => void;
}

const Slider: React.FC<SliderProps> = ({value = 1, onChange}) => {
    const handleChange = (newValue: number[]) => {
        onChange?.(newValue[0]);
    }
    
    return (
        <RadixSlider.Root value={[value]} max={1} aria-label="volume" step={0.1} onValueChange={handleChange} defaultValue={[1]} className='relative flex items-center select-none touch-none w-full h-10'>
            <RadixSlider.Track className='bg-neutral-600 relative grow rounded-full h-[3px]'>
                <RadixSlider.Range  className='absolute bg-white rounded-full h-full' />
            </RadixSlider.Track>
        </RadixSlider.Root>
    );
}
export default Slider;