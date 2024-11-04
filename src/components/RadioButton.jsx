export default function RadioButton({ name, title, value, typeTasks, handleOptionChange }) {
  const checked = typeTasks === value;

  return (
    <label className="radio">
      <input
        type="radio"
        name={name}
        value={value}
        className="radio__input"
        onChange={handleOptionChange}
        checked={checked} />
      <div className="radio__state">
          <div className="radio__control">
              <div className="radio__circle"></div>
          </div>
          <div className="radio__title">{title}</div>
      </div>
    </label>
  )
}