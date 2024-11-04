import { Select } from "antd";

export default function SelectDeadline({ selectedDeadline, handleUserSelectDeadline }) {
  return (
    <Select
      defaultActiveFirstOption
      className="select-deadline"
      size="large"
      placeholder="Show tasks by deadline"
      value={selectedDeadline}
      onChange={(value) => handleUserSelectDeadline(value)}
      options={
        [
          { value: 'all', label: 'Show tasks with all deadlines'},
          { value: 'today', label: 'Need to finish Today'},
          { value: 'tomorrow', label: 'Need to finish Tomorrow'},
          { value: 'thisWeek', label: 'Need to finish This Week'}
        ]
      } />
  )
}