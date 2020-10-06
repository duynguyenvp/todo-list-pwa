import { getObject, setObject } from "../helpers/localForage";

import { useEffect, useState } from "react";

let registeredObjects = [];
let _todos = [];
const subscribes = (f) => {
  registeredObjects.push(f);
  return () => unsubscribe(registeredObjects.filter((a) => a !== f));
};
const unsubscribe = (subcribes) => (registeredObjects = subcribes);
const onChange = () => {
  registeredObjects.forEach((f) => {
    f();
  });
};

export const getTodos = () => _todos;
export const setTodos = async (todos) => {
  _todos = [...todos];
  await setObject("todos", _todos);
  onChange();
};
export const addTodo = async (todo) => {
  _todos = [..._todos, todo];
  await setObject("todos", _todos);
  onChange();
};
export const removeTodo = async (id) => {
  _todos = _todos.filter((f) => f.id !== id);
  await setObject("todos", _todos);
  onChange();
};
export const clearTodos = async () => {
  _todos = [];
  await setObject("todos", _todos);
  onChange();
};
export function useTodosStore() {
  const [todos, setTodos] = useState(getTodos);
  useEffect(() => {
    getObject("todos")
      .then((data) => {
        setTodos(data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    const unsubcribes = subscribes(() => {
      setTodos(getTodos);
    });
    return () => {
      unsubcribes();
    };
  }, []);

  return todos;
}
