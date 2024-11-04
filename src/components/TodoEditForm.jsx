import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import _ from 'lodash';

export default function TodoEditForm({ name, description, deadline, id, handleEditingItem, handleCancelEditingItem }) {
  const initialState = {
    editName: name,
    editDescription: description,
    editDeadline: deadline,
  }

  const [formData, setFormData] = useState(initialState);

  const { editName, editDescription, editDeadline} = formData;
  const date = editDeadline ? dayjs(editDeadline) : null;
  const submitDisabled = editName.trim() === '' || editDescription.trim() === '' || _.isNull(editDeadline);

  const handleUserInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUserPickingDeadline = (date) => {
    if (date) {
      setFormData((prevState) => ({
        ...prevState,
        editDeadline: dayjs(date).format('YYYY-MM-DD'),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        editDeadline: null,
      }));
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleCancelEditingItem(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditingItem(formData, id);
  }

  return (
    <div className="todo-form-container">
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="todo-form__form-group">
          <label htmlFor="task-name">Task Name</label>
          <input value={editName} onChange={handleUserInput} className="todo-form__input" name="editName" type="text" id="task-name" />
        </div>
        <div className="todo-form__form-group">
          <label htmlFor="task-description">Description</label>
          <input value={editDescription} onChange={handleUserInput} className="todo-form__input" name="editDescription" type="text" id="task-description" />
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
        <button className="btn btn_submit" onClick={handleCancel}>Cancel</button>
        <button disabled={submitDisabled} className="btn btn_submit" type="submit">Submit</button>
      </form>
    </div>
  )
}