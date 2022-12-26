import React, { useEffect, useState } from 'react';
import { styleTodos as style } from '../styles/styleTodos';

import { AiOutlinePlus } from 'react-icons/ai';
import { FiEdit3 } from 'react-icons/fi';
import ToDoList from '../components/ToDoList';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

function Todos() {
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navegation = useNavigate();
  const [dataDB, setDataDB] = useState({ user: { tasks: [] } });
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [editMode, setEditMode] = useState({
    id: '',
    isDone: false,
    edit: false,
  });

  useEffect(() => {
    if (!token) {
      navegation('/login');
    }
    try {
      const getData = async (token) => {
        const { data } = await axios.get(
          'https://api-todo-list-glnl.onrender.com/',
          {
            headers: {
              token,
            },
          }
        );
        console.log(data);
        setDataDB(data);
        setLoading(false);
      };
      getData(JSON.parse(token)?.token);
    } catch (error) {
      console.log(error);
      navegation('/login');
    }
  }, []);

  useEffect(() => {
    setTodos([...(dataDB?.user?.tasks || [])]);
    if (dataDB?.user?.tasks.length >= 10) {
      setIsDisabled(true);
    }
  }, [dataDB]);

  const logout = () => {
    localStorage.clear();
    navegation('/login');
  };

  const updateTasks = async (todos) => {
    try {
      // const { data } =
      await axios.patch(
        'https://api-todo-list-glnl.onrender.com/',
        { tasks: todos },
        {
          headers: {
            token: JSON.parse(token)?.token,
          },
        }
      );
    } catch (error) {
      console.log(error);
      navegation('/login');
    }
  };

  const toggleComplete = async (task) => {
    const taskToggle = todos.find((el) => el.id === task.id);
    // console.log(taskToggle);
    taskToggle.isDone = !task.isDone;
    setTodos([...todos]);
    updateTasks([...todos]);
  };

  const createTodo = async (todo) => {
    if (todo.trim().length <= 0) {
      setInput('');
      return global.alert('Type something');
    }
    if (todos.length >= 10) {
      setInput('');
      return global.alert('Max todos 10');
    }
    if (todos.length === 9) {
      setIsDisabled(true);
    }
    const newTask = {
      id: todos.length,
      task: todo.trim().slice(0, 40),
      isDone: false,
    };
    setTodos([...todos, newTask]);
    setInput('');
    updateTasks([...todos, newTask]);
  };

  const editTodo = ({ id, task, isDone }) => {
    setEditMode({
      id,
      isDone,
      edit: true,
    });
    setInput(task);
  };

  const goEdit = async (task, id, isDone) => {
    const taskToggle = todos.find((el) => el.id === id);
    taskToggle.task = task;
    taskToggle.isDone = isDone;
    setTodos([...todos]);
    setEditMode({
      id: '',
      isDone: false,
      edit: false,
    });
    setInput('');
    updateTasks([...todos]);
  };

  const deleteTodo = async (id) => {
    // await deleteDoc(doc(db, 'todos', id));
    const todosFiltred = todos
      .filter((el) => el.id !== id)
      .map((el, i) => {
        el.id = i;
        return el;
      });
    setTodos(todosFiltred);
    if (isDisabled) {
      setIsDisabled(false);
    }
    updateTasks([...todosFiltred]);
  };

  if (loading) return <Loading />;

  return (
    <div className={style.bg}>
      <button
        onClick={logout}
        type='button'
        className={style.button}
        style={{ borderRadius: '8px', margin: '5px auto', padding: '9px' }}
      >
        Logout
      </button>
      <div className={`${style.container}`}>
        <h3 className={style.heading}>To Do App - FullStack</h3>
        <form className={style.form}>
          <input
            disabled={isDisabled && !editMode.edit}
            maxLength={40}
            value={input}
            className={style.input}
            type='text'
            placeholder={isDisabled ? 'Max todos 10' : 'Add task'}
            onChange={({ target: { value } }) => setInput(value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                editMode.edit
                  ? goEdit(input, editMode.id, editMode.isDone)
                  : createTodo(input);
              }
            }}
          />
          <button
            className={style.button}
            disabled={isDisabled && !editMode.edit}
            type='button'
            onClick={() =>
              editMode.edit
                ? goEdit(input, editMode.id, editMode.isDone)
                : createTodo(input)
            }
          >
            {editMode.edit ? (
              <FiEdit3 size={30} color={'white'} />
            ) : (
              <AiOutlinePlus size={30} color={'white'} />
            )}
          </button>
        </form>
        <ul>
          {todos.map((task) => (
            <ToDoList
              {...task}
              key={task.id}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ))}
        </ul>
        {todos.length > 0 && (
          <p
            className={style.count}
            style={{
              color: 'black',
              fontWeight: '600',
            }}
          >
            {`You have ${todos.length} Todo${todos.length > 1 ? 's' : ''} / 10`}
          </p>
        )}
      </div>
    </div>
  );
}

export default Todos;
