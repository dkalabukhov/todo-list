import { useState } from "react"
import cn from 'classnames';

export default function Checkbox({ id, handleSelectingTask, isChecked }) {
  const [isPressed, setIsPressed] = useState(false);
  const checkboxControlClasses = cn('checkbox__control', {
    'checkbox__control_checked': isPressed && !isChecked,
  });

  const handleChecked = () => {
    setIsPressed((prevValue) => !prevValue);
  }

  return (
    <label className="checkbox">
      <input checked={isChecked} onChange={() => {handleSelectingTask(id); handleChecked()}} type="checkbox" className="checkbox__input" name="checkbox" />
      <div className="checkbox__state">
          <div className={checkboxControlClasses}>
              <svg className="checkbox__icon" width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 7.5L5 11L13 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
      </div>
    </label>
  )
}