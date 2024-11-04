import { DatePicker } from "antd"
import dayjs from "dayjs";
import _ from 'lodash';

export default function TodoCreateForm({ formValues, handleUserInput, handleUserPickingDeadline, handleUserSubmitForm, errorMsg, handleCancel }) {
  const { name, description, deadline } = formValues;

  const date = deadline ? dayjs(deadline) : null;

  const submitDisabled = name.trim() === '' || description.trim() === '' || _.isNull(deadline);

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleUserSubmitForm}>
        <div className="todo-form__form-group">
          <label htmlFor="task-name">Task Name</label>
          <input value={name} onChange={handleUserInput} className="todo-form__input" name="name" type="text" id="task-name" />
        </div>
        <div className="todo-form__form-group">
          <label htmlFor="task-description">Description</label>
          <input value={description} onChange={handleUserInput} className="todo-form__input" name="description" type="text" id="task-description" />
        </div>
        <div className="todo-form__form-group">
          <label htmlFor="task-description">Deadline</label>
          <DatePicker
            value={date}
            onChange={(date) => {
              handleUserPickingDeadline(date)
            }}
            className="todo-form__date-picker" />
        </div>
        <button type="submit" className="btn btn_submit" onClick={handleCancel}>Cancel</button>
        <button disabled={submitDisabled} className="btn btn_submit" type="submit">Submit</button>
      </form>
      <div className="error">{errorMsg}</div>
    </div>
  )
}