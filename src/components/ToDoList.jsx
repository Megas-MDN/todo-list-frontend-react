import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

import { styleTodo as style } from '../styles/styleTodos';

function ToDoList({
  task,
  isDone = false,
  toggleComplete,
  id,
  deleteTodo,
  editTodo,
}) {
  return (
    <li className={isDone ? style.liComplete : style.li}>
      <div className={style.row}>
        <input
          type='checkbox'
          name=''
          id={task + id}
          checked={isDone}
          onChange={() => toggleComplete({ task, isDone, id })}
        />
        <label
          className={isDone ? style.textComplete : style.text}
          htmlFor={task + id}
        >
          {task}
        </label>
      </div>
      <div className={style.buttonContainer}>
        <button
          type='button'
          className={style.button}
          onClick={() => editTodo({ id, task, isDone })}
        >
          <FiEdit color={'black'} />
        </button>
        <button
          type='button'
          className={style.button}
          onClick={() => deleteTodo(id)}
        >
          <FaRegTrashAlt color={'black'} />
        </button>
      </div>
    </li>
  );
}

export default ToDoList;
