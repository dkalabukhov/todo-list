import { useEffect, useState } from "react";
import AddNewTaskButton from "./AddNewTaskButton";
import TodoCreateForm from "./TodoCreateForm";
import dayjs from "dayjs";
import _ from "lodash";
import TodoItem from "./TodoItem";
import TodoEditForm from "./TodoEditForm";
import RadioButton from "./RadioButton";
import SeacrhInput from "./SearchInput";
import isSeacrhStringMatches from "../utils/isSearchStringMatches";
import SelectDeadline from "./SelectDeadline";
import { showAllDeadlines, isTodayDeadline, isTomorrowDeadline, isThisWeekDeadline } from "../utils/showDeadlines";
import DeleteModal from "./DeleteModal";
import ThemeChanger from "./ThemeChanger";

const initialState = {
  tasksUi: {},
  tasks: {},
  formValues: {
    name: '',
    description: '',
    deadline: null,
  },
  searchInput: '',
  typeTasks: 'all',
  selectedDeadline: 'all',
  isSelectingMultipleTasks: false,
  isDeleteModalOpen: false,
  idToDelete: null,
  isDarkThemeEnabled: false,
}

export default function TodoList() {
  const [state, setState] = useState(initialState);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    formValues,
    tasks,
    tasksUi,
    searchInput,
    typeTasks,
    selectedDeadline,
    isSelectingMultipleTasks,
    isDeleteModalOpen,
    idToDelete,
    isDarkThemeEnabled,
  } = state;
  const { name, description, deadline } = formValues;

  const isAnyTasks = _.keys(tasks).some((taskKey) => !_.isNull(tasks[taskKey]));

  useEffect(() => {
    const keys = _.keys(tasksUi);
    const isAnySelectedTasks = keys.some((key) => tasksUi[key]?.isSelected === true);
    if (isAnySelectedTasks) {
      changeStateSelectingMultipleTasksToTrue();
    } else {
      changeStateSelectingMultipleTasksToFalse();
    }
  }, [tasksUi]);

  useEffect(() => {
    const html = document.documentElement;
    html.toggleAttribute('data-theme-dark');
  }, [isDarkThemeEnabled])

  const handleAddingTask = () => {
    setIsAdding(true);
  }

  const toggleTheme = () => {
    setState((prevState) => ({
      ...prevState,
      isDarkThemeEnabled: !prevState.isDarkThemeEnabled,
    }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setIsAdding(false);
    setState((prevState) => ({
      ...prevState,
      formValues: {
        name: '',
        description: '',
        deadline: null,
      }
    }));
  }

  const handleUserInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const handleUserPickingDeadline = (date) => {
    if (date) {
      setState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          deadline: dayjs(date).format('YYYY-MM-DD'),
        }
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        formValues: {
          ...prevState.formValues,
          deadline: null,
        }
      }));
    }
  };

  const hadnleUserSubmitForm = (e) => {
    e.preventDefault();
    if (name.trim() === '' || description.trim() === '' || _.isNull(deadline)) {
      setErrorMsg('Please fill all the inputs in the form')
      return;
    }
    setErrorMsg('');
    const id = _.uniqueId();
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: { isFinished: false, isEditing: false, isSelected: false }
      },
      tasks: {
        ...prevState.tasks,
        [id]: {
          name: prevState.formValues.name,
          description: prevState.formValues.description,
          deadline: prevState.formValues.deadline
        }}
    }));
    setState((prevState) => ({
      ...prevState,
      formValues: {
        name: '',
        description: '',
        deadline: null,
      }
    }));
    setIsAdding(false);
  };

  const handleMakingTaskDone = (id) => () => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isFinished: !prevState.tasksUi[id].isFinished
        }
      }
    }));
  };

  const handleRemovingTask = () => {
    const id = idToDelete;
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: null,
      },
      tasks: {
        ...prevState.tasks,
        [id]: null,
      }
    }));
    handleCloseModal();
  };

  const handleOpenDeleteModal = (id) => () => {
    setState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: true,
      idToDelete: id,
    }));
  };

  const handleEditingTask = (id) => () => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isEditing: true,
        }
      }
    }));
  };

  const handleEditingItem = (data, id) => {
    const { editName, editDescription, editDeadline} = data;
    setState((prevState) => ({
      ...prevState,
      tasks: {
        ...prevState.tasks,
        [id]: {
          name: editName,
          description: editDescription,
          deadline: editDeadline,
        }
      },
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isEditing: false,
        }
      },
    }));
  };

  const handleCancelEditingItem = (id) => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isEditing: false,
        }
      },
    }));
  };

  const handleOptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      typeTasks: e.target.value,
    }));
  };

  const handleSelectingTask = (id) => () => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isSelected: !prevState.tasksUi[id].isSelected,
        }
      }
    }));
  };

  const changeStateSelectingMultipleTasksToTrue = () => {
    setState((prevState) => ({
      ...prevState,
      isSelectingMultipleTasks: true,
    }));
  };

  const changeStateSelectingMultipleTasksToFalse = () => {
    setState((prevState) => ({
      ...prevState,
      isSelectingMultipleTasks: false,
    }));
  };

  const mappingDeadlies = {
    all: (deadline) => showAllDeadlines(deadline),
    today: (deadline) => isTodayDeadline(deadline),
    tomorrow: (deadline) => isTomorrowDeadline(deadline),
    thisWeek: (deadline) => isThisWeekDeadline(deadline),
  };

  const renderAllItems = () => {
    const keys = _.keys(tasks);
    return keys.map((taskKey) => {
      if (_.isNull(tasks[taskKey])) return null;
      if (searchInput.trim() !== '') {
        if (!isSeacrhStringMatches(tasks[taskKey].name, tasks[taskKey].description, searchInput)) {
          return null;
        }
      }
      if (!mappingDeadlies[selectedDeadline](tasks[taskKey].deadline)) return null;
      if (tasksUi[taskKey].isEditing) {
        return (
          <TodoEditForm
            key={_.uniqueId()}
            name={tasks[taskKey].name}
            description={tasks[taskKey].description}
            deadline={tasks[taskKey].deadline}
            handleCancelEditingItem={handleCancelEditingItem}
            handleEditingItem={handleEditingItem}
            id={taskKey}/>
        );
      }
      return (
        <TodoItem
          key={_.uniqueId()}
          id={taskKey}
          isFinished={tasksUi[taskKey].isFinished}
          name={tasks[taskKey].name}
          description={tasks[taskKey].description}
          deadline={tasks[taskKey].deadline}
          isChecked={tasksUi[taskKey].isSelected}
          handleSelectingTask={handleSelectingTask}
          changeStateSelectingMultipleTasksToTrue={changeStateSelectingMultipleTasksToTrue}
          changeStateSelectingMultipleTasksToFalse={changeStateSelectingMultipleTasksToFalse}
          handleMakingTaskDone={handleMakingTaskDone}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleEditingTask={handleEditingTask} />
      )
    });
  }

  const renderFinishedItems = () => {
    const keys = _.keys(tasks);
    return keys.map((taskKey) => {
      if (_.isNull(tasks[taskKey])) return null;
      if (!tasksUi[taskKey].isFinished) return null;
      if (searchInput.trim() !== '') {
        if (!isSeacrhStringMatches(tasks[taskKey].name, tasks[taskKey].description, searchInput)) {
          return null;
        }
      }
      if (!mappingDeadlies[selectedDeadline](tasks[taskKey].deadline)) return null;
      if (tasksUi[taskKey].isEditing) {
        return (
          <TodoEditForm
            key={_.uniqueId()}
            name={tasks[taskKey].name}
            description={tasks[taskKey].description}
            deadline={tasks[taskKey].deadline}
            handleCancelEditingItem={handleCancelEditingItem}
            handleEditingItem={handleEditingItem}
            id={taskKey}/>
        );
      }
      return (
        <TodoItem
          key={_.uniqueId()}
          id={taskKey}
          isFinished={tasksUi[taskKey].isFinished}
          name={tasks[taskKey].name}
          description={tasks[taskKey].description}
          deadline={tasks[taskKey].deadline}
          handleSelectingTask={handleSelectingTask}
          isChecked={tasksUi[taskKey].isSelected}
          changeStateSelectingMultipleTasksToTrue={changeStateSelectingMultipleTasksToTrue}
          changeStateSelectingMultipleTasksToFalse={changeStateSelectingMultipleTasksToFalse}
          handleMakingTaskDone={handleMakingTaskDone}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleEditingTask={handleEditingTask} />
      )
    });
  }

  const renderUnfinishedItems = () => {
    const keys = _.keys(tasks);
    return keys.map((taskKey) => {
      if (_.isNull(tasks[taskKey])) return null;
      if (tasksUi[taskKey].isFinished) return null;
      if (searchInput.trim() !== '') {
        if (!isSeacrhStringMatches(tasks[taskKey].name, tasks[taskKey].description, searchInput)) {
          return null;
        }
      }
      if (!mappingDeadlies[selectedDeadline](tasks[taskKey].deadline)) return null;
      if (tasksUi[taskKey].isEditing) {
        return (
          <TodoEditForm
            key={_.uniqueId()}
            name={tasks[taskKey].name}
            description={tasks[taskKey].description}
            deadline={tasks[taskKey].deadline}
            handleCancelEditingItem={handleCancelEditingItem}
            handleEditingItem={handleEditingItem}
            id={taskKey}/>
        );
      }
      return (
        <TodoItem
          key={_.uniqueId()}
          id={taskKey}
          isFinished={tasksUi[taskKey].isFinished}
          name={tasks[taskKey].name}
          description={tasks[taskKey].description}
          deadline={tasks[taskKey].deadline}
          isEditing={tasksUi[taskKey].isEditing}
          handleMakingTaskDone={handleMakingTaskDone}
          handleOpenDeleteModal={handleOpenDeleteModal}
          handleEditingTask={handleEditingTask}
          handleSelectingTask={handleSelectingTask}
          isChecked={tasksUi[taskKey].isSelected}
          changeStateSelectingMultipleTasksToTrue={changeStateSelectingMultipleTasksToTrue}
          changeStateSelectingMultipleTasksToFalse={changeStateSelectingMultipleTasksToFalse} />
      )
    });
  };

  const handleUserSearchInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      searchInput: e.target.value,
    }))
  };

  const handleUserSelectDeadline = (value) => {
    setState((prevState) => ({
      ...prevState,
      selectedDeadline: value,
    }));
  };

  const handleMarkingMultipleTasksDone = () => {
    const keys = _.keys(tasksUi);
    const idsToUpdate = keys.reduce((acc, key) => {
      if (tasksUi[key]?.isSelected === true) {
        acc.push(key);
      }
      return acc;
    }, []);
    idsToUpdate.forEach((id) => {
      setState((prevState) => ({
        ...prevState,
        tasksUi: {
          ...prevState.tasksUi,
          [id]: {
            ...prevState.tasksUi[id],
            isFinished: true,
          }
        }
      }))
    });
  };

  const handleDeletingMultipleTasks = () => {
    const keys = _.keys(tasksUi);
    const idsToDelete = keys.reduce((acc, key) => {
      if (tasksUi[key]?.isSelected === true) {
        acc.push(key);
      }
      return acc;
    }, []);
    idsToDelete.forEach((id) => {
      setState((prevState) => ({
        ...prevState,
        tasksUi: {
          ...prevState.tasksUi,
          [id]: null,
        },
        tasks: {
          ...prevState.tasks,
          [id]: null,
        }
      }));
    });
  };

  const handleCloseModal = () => {
    setState((prevState) => ({
      ...prevState,
      isDeleteModalOpen: false,
      idToDelete: null,
    }));
  }

  const mappingTypes = {
    all: renderAllItems,
    finished: renderFinishedItems,
    unfinished: renderUnfinishedItems,
  };

  return (
    <div className="todo-list">
      <h1 className="todo-list__heading">TODO-list</h1>
      <ThemeChanger toggleTheme={toggleTheme} isDarkThemeEnabled={isDarkThemeEnabled} />
      {isAnyTasks &&
        <div className="filters">
          <div className="radios">
            <RadioButton handleOptionChange={handleOptionChange} name="radio" value="all" title="All" typeTasks={typeTasks} />
            <RadioButton handleOptionChange={handleOptionChange} name="radio" value="finished" title="Finished" typeTasks={typeTasks} />
            <RadioButton handleOptionChange={handleOptionChange} name="radio" value="unfinished" title="Not Finished" typeTasks={typeTasks} />
          </div>
          <SelectDeadline
            selectedDeadline={selectedDeadline}
            handleUserSelectDeadline={handleUserSelectDeadline} />
          <SeacrhInput searchInput={searchInput} handleUserSearchInput={handleUserSearchInput} />
        </div>
      }
      {isSelectingMultipleTasks &&
          <div className="buttons-group">
            <button onClick={handleDeletingMultipleTasks} className="btn btn_submit btn_small">
              <span>Delete Selected</span>
            </button>
            <button onClick={handleMarkingMultipleTasksDone} className="btn btn_submit btn_small">
              <span>Mark Selected As Done</span>
            </button>
          </div>
      }
      <AddNewTaskButton isAdding={isAdding} handleAddingTask={handleAddingTask} />
      {isAdding &&
        <TodoCreateForm
          handleUserInput={handleUserInput}
          handleUserPickingDeadline={handleUserPickingDeadline}
          formValues={formValues}
          handleUserSubmitForm={hadnleUserSubmitForm}
          errorMsg={errorMsg}
          handleCancel={handleCancel} />
      }
      {mappingTypes[typeTasks]()}
      {isDeleteModalOpen && <DeleteModal handleRemovingTask={handleRemovingTask} handleCloseModal={handleCloseModal} /> }
    </div>
  )
}