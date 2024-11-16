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
import ThemeChanger from "./ThemeChanger";
import useConfirm from "./ConfirmDialog";

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
  isDarkThemeEnabled: false,
  isAdding: false,
}

export default function TodoList() {
  const storedState = JSON.parse(localStorage.getItem('state'));

  const stateToUse = _.isNull(storedState) ? initialState : storedState;

  const [state, setState] = useState(stateToUse);

  // Используем контекст, передающий сеттер модального окна
  const confirmDialog = useConfirm();

  const {
    formValues,
    tasks,
    tasksUi,
    searchInput,
    typeTasks,
    selectedDeadline,
    isSelectingMultipleTasks,
    isDarkThemeEnabled,
    isAdding,
  } = state;
  const { name, description, deadline } = formValues;

  // Перменная, которая хранит в себе булево значение: есть ли хотя бы один таск,
  // значение которого не равно null.
  const isAnyTasks = _.keys(tasks).some((taskKey) => !_.isNull(tasks[taskKey]));

  // При каждом изменении state сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  // Хук проверяет, есть ли хотя бы один выбранный таск и по условию меняет state
  useEffect(() => {
    const keys = _.keys(tasksUi);
    const isAnySelectedTasks = keys.some((key) => tasksUi[key]?.isSelected === true);
    if (isAnySelectedTasks) {
      changeStateSelectingMultipleTasksToTrue();
    } else {
      changeStateSelectingMultipleTasksToFalse();
    }
  }, [tasksUi]);

  // Хук меняет тему при изменении соответствующего значения в state
  useEffect(() => {
    const html = document.documentElement;
    isDarkThemeEnabled
      ? html.setAttribute('data-theme-dark', '')
      : html.removeAttribute('data-theme-dark');
  }, [isDarkThemeEnabled]);

  // Функция, меняющая в state значение isAdding на true - флаг добавления задачи
  const handleAddingTask = () => {
    setState((prevState) => ({
      ...prevState,
      isAdding: true,
    }));
  };

  // Функция, меняющая в state значение isAdding на false - флаг добавления задачи
  const setAddingTaskToFalse = () => {
    setState((prevState) => ({
      ...prevState,
      isAdding: false,
    }));
  }

  // Функция, меняющая флаг темы в state
  const toggleTheme = () => {
    setState((prevState) => ({
      ...prevState,
      isDarkThemeEnabled: !prevState.isDarkThemeEnabled,
    }));
  };

  // Функция, которая отменяет создание нового таска: меняет флаг
  // isAdding на false и очищает форму
  const handleCancelAddingTask = (e) => {
    e.preventDefault();
    setAddingTaskToFalse();
    setState((prevState) => ({
      ...prevState,
      formValues: {
        name: '',
        description: '',
        deadline: null,
      }
    }));
  }

  // Функция, которая записывает в state значения из формы добавления нового таска
  const handleUserInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      formValues: {
        ...prevState.formValues,
        [e.target.name]: e.target.value,
      }
    }));
  };

  // Функция, которая добавляет в state значение дедлайна из формы добавления нового таска
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

  // Функция, которая создает новый таск, очищает инпуты, и ставит флагу isAdding
  // значение false
  const hadnleUserSubmitForm = (e) => {
    e.preventDefault();
    const id = _.uniqueId();
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          isFinished: false,
          isEditing: false,
          isSelected: false,
          isRemoving: false,
          isDescriptionShown: false
        },
      },
      tasks: {
        ...prevState.tasks,
        [id]: {
          name,
          description,
          deadline,
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
    setAddingTaskToFalse();
  };

  // Функция, которая помечает таск как выполненный
  const handleMakingTaskDone = (id, target) => {
    if (!state.tasksUi[id].isFinished) {
      target.classList.add('todo-item_finished-anim');
      setTimeout(() => {
        target.classList.remove('todo-item_finished-anim');
        setState((prevState) => ({
          ...prevState,
          tasksUi: {
            ...prevState.tasksUi,
            [id]: {
              ...prevState.tasksUi[id],
              isFinished: !prevState.tasksUi[id].isFinished
            }
          }
        }))}, 300);
    } else {
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
    }
  };

  // Функция помечает таск как удаляемый
  const markTaskAsRemoving = (id) => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isRemoving: true,
        }
      }
    }));
  }

  // Переключает значение isDescriptionShown (открыто ли описание задачи) в state
  const setIsDescriptionShown = (id) => () => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isDescriptionShown: !prevState.tasksUi[id].isDescriptionShown,
        },
      },
    }));
  };

  // Функция, которая удаляет таск
  const handleRemovingTask = (id) => async () => {
    const choice = await confirmDialog();
    if (choice) {
      markTaskAsRemoving(id);
      setTimeout(() =>
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
        })), 500);
    }
  };

  // Функция, которая устанавливает значение флага isEditing как true
  // при клике на кнопку редактирования таска
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

  // Функция которая редактирует информацию таска и ставит флаг isEditing как false
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

  // Функция, которая отменяет редактирование таска
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

  // Функция, которая меняет в state тип выбранных задач: all, finished, unfinished
  const handleOptionChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      typeTasks: e.target.value,
    }));
  };

  // Функция, которая помечает таск как "выбранный"
  const handleSelectingTask = (id) => {
    setTimeout(() => {
    setState((prevState) => ({
      ...prevState,
      tasksUi: {
        ...prevState.tasksUi,
        [id]: {
          ...prevState.tasksUi[id],
          isSelected: !prevState.tasksUi[id].isSelected,
        }
      }
    }))}, 200);
  };

  // Функция, которая ставит флаг isSelectingMultipleTasks как true
  const changeStateSelectingMultipleTasksToTrue = () => {
    setState((prevState) => ({
      ...prevState,
      isSelectingMultipleTasks: true,
    }));
  };

  // Функция, которая ставит флаг isSelectingMultipleTasks как false
  const changeStateSelectingMultipleTasksToFalse = () => {
    setState((prevState) => ({
      ...prevState,
      isSelectingMultipleTasks: false,
    }));
  };

  // Объект для диспетчиризации по ключу (дэдлайны). Каждое значение ключа объекта - это
  // функция, котора фильтрует таски по сроку дедлайна. Функции находядтся в папке utils и
  // возвращают булево значение
  const mappingDeadlies = {
    all: (deadline) => showAllDeadlines(deadline),
    today: (deadline) => isTodayDeadline(deadline),
    tomorrow: (deadline) => isTomorrowDeadline(deadline),
    thisWeek: (deadline) => isThisWeekDeadline(deadline),
  };

  // Фильтрация тасков
  const filterTasks = (keys) => {
    return keys.filter((taskKey) => {
      if (_.isNull(tasks[taskKey])) return false;
      if (searchInput.trim() !== '') {
        if (!isSeacrhStringMatches(tasks[taskKey].name, tasks[taskKey].description, searchInput)) {
          return false;
        }
      }
      if (!mappingDeadlies[selectedDeadline](tasks[taskKey].deadline)) return false;
      switch(typeTasks) {
        case 'finished':
          if (!tasksUi[taskKey].isFinished) return false;
          break;
        case 'unfinished':
          if (tasksUi[taskKey].isFinished) return false;
          break;
        default:
          break;
      }

      return true;
    })
  }

  // Рендер тасков
  const renderTasks = () => {
    const keys = _.keys(tasks);
    const filteredKeys = filterTasks(keys)
    return filteredKeys.map((taskKey) => {
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
          handleEditingTask={handleEditingTask}
          handleRemovingTask={handleRemovingTask}
          isRemoving={tasksUi[taskKey].isRemoving}
          isDescriptionShown={tasksUi[taskKey].isDescriptionShown}
          setIsDescriptionShown={setIsDescriptionShown}  />
      )
    });
  }

  // Функция записывает в state значения поля поиска по таскам
  const handleUserSearchInput = (e) => {
    setState((prevState) => ({
      ...prevState,
      searchInput: e.target.value,
    }))
  };

  // Функция записывает значения фильтра по дедлайнам в state
  const handleUserSelectDeadline = (value) => {
    setState((prevState) => ({
      ...prevState,
      selectedDeadline: value,
    }));
  };

  // Функция помечает несколько тасков как выполненные
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

  // Функция удаляет несколько тасков
  const handleDeletingMultipleTasks = async () => {
    const choice = await confirmDialog();
    if (choice) {
      const keys = _.keys(tasksUi);
      const idsToDelete = keys.reduce((acc, key) => {
        if (tasksUi[key]?.isSelected === true) {
          acc.push(key);
        }
        return acc;
      }, []);
      idsToDelete.forEach((id) => {
        markTaskAsRemoving(id);
        setTimeout(() => {
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
        }, 500);
      });
    }
  };

  return (
    <>
      <div className="todo-list">
        <div className="todo-list__container">
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
              handleCancelAddingTask={handleCancelAddingTask} />
          }
          {renderTasks()}
        </div>
      </div>
    </>
  )
}