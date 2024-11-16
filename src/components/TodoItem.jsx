import cn from 'classnames';
import dayjs from 'dayjs';
import Checkbox from './Checkbox';

export default function TodoItem({
  name,
  description,
  deadline,
  id,
  handleMakingTaskDone,
  handleDeletingTask,
  isFinished,
  handleEditingTask,
  handleSelectingTask,
  isChecked,
  isRemoving,
  isDescriptionShown,
  setIsDescriptionShown }) {
  const todoItemClasses = cn('todo-item', {
    'todo-item_finished': isFinished,
    'todo-item_overdue': deadline < dayjs().format('YYYY-MM-DD'),
    'todo-item_removing': isRemoving,
  })

  const cuttedDescription = description.slice(0, 2) + '...';

  return (
    <div className={todoItemClasses}>
      <button className='btn btn_gap btn_flex-start todo-item__grid-item no-decoration' onClick={(e) => handleMakingTaskDone(id, e.target.closest('.todo-item'))}>
        {isFinished
          ?
            <>
              <span>Make Unfinished</span>
              <svg className="todo-item__icon" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <path d="M256,7C118.467,7,7,118.468,7,256.002C7,393.533,118.467,505,256,505s249-111.467,249-248.998  C505,118.468,393.533,7,256,7z M256,485.08c-126.31,0-229.08-102.771-229.08-229.078C26.92,129.692,129.69,26.92,256,26.92  c126.309,0,229.08,102.771,229.08,229.082C485.08,382.309,382.309,485.08,256,485.08z" fill="currentColor"/><polygon fill="currentColor" points="368.545,157.073 354.461,142.988 255.863,241.587 157.733,143.456 143.648,157.54 241.78,255.672   143.648,353.809 157.733,367.893 255.863,269.75 354.461,368.361 368.545,354.275 269.947,255.672 "/>
              </svg>
            </>
          :
            <>
              <span>Make Done</span>
              <svg className="todo-item__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" fill="currentColor"/>
              </svg>
            </>
        }
      </button>
      <span className='todo-item__grid-item'>{name}</span>
      {isDescriptionShown
      ? <button onClick={setIsDescriptionShown(id)}>
          <span className='todo-item__line-through'>{description}</span> <span className='todo-item__read-more'>hide description</span>
        </button>
      : <button onClick={setIsDescriptionShown(id)}>
          <span className='todo-item__line-through'>{cuttedDescription}</span> <span className='todo-item__read-more'>show description</span>
        </button>
      }
      <span className='todo-item__grid-item'>{deadline}</span>
      <div className='buttons-group todo-item__grid-item'>
        <Checkbox isChecked={isChecked} id={id} handleSelectingTask={handleSelectingTask} />
        <button onClick={handleEditingTask(id)}>
          <svg className='todo-item__icon' fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button onClick={handleDeletingTask(id)} className='todo-item__remove-btn'>
          <svg className="todo-item__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9H22M19 14H22M19 19H21M16 6L15.1991 18.0129C15.129 19.065 15.0939 19.5911 14.8667 19.99C14.6666 20.3412 14.3648 20.6235 14.0011 20.7998C13.588 21 13.0607 21 12.0062 21H7.99377C6.93927 21 6.41202 21 5.99889 20.7998C5.63517 20.6235 5.33339 20.3412 5.13332 19.99C4.90607 19.5911 4.871 19.065 4.80086 18.0129L4 6M2 6H18M14 6L13.7294 5.18807C13.4671 4.40125 13.3359 4.00784 13.0927 3.71698C12.8779 3.46013 12.6021 3.26132 12.2905 3.13878C11.9376 3 11.523 3 10.6936 3H9.30643C8.47705 3 8.06236 3 7.70951 3.13878C7.39792 3.26132 7.12208 3.46013 6.90729 3.71698C6.66405 4.00784 6.53292 4.40125 6.27064 5.18807L6 6M12 10V17M8 10L7.99995 16.9998" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}