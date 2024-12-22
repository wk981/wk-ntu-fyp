import { ComboBox } from '@/components/combo-box'
import { MultiSelectComboBox } from '@/components/multi-select-combo-box'
import { useState } from 'react'
const mockData = [
  {
    label: 'Entry Level',
    value: 'Entry Level',
  },
  {
    label: 'Mid Level',
    value: 'Mid Level',
  },
  {
    label: 'Senior Level',
    value: 'Senior Level',
  },
]
export const Landing = () => {
  const [value1, setValue1] = useState<string>('')
  const [value2, setValue2] = useState<string[]>([])

  return (
    <div className="mt-32">
      <ComboBox data={mockData} value={value1} setValue={setValue1} />
      <MultiSelectComboBox
        data={mockData}
        value={value2}
        setValue={setValue2}
        showValues={false}
      />
    </div>
  )
}
