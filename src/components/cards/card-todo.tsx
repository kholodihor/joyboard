'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';

import { toast } from 'sonner';

import {
  addCardTodo,
  changeTodoCompleted,
  removeCardTodo,
} from '@/app/actions/card';
import { Card, Todo } from '@/types';

import FormSubmit from '../atomic/form-submit';
import TextAreaForm from '../atomic/textarea-form';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

import SubTitle from './sub-title';

interface CardProps {
  cardData: Card;
  setCardData: (cardData: any) => void;
}

const CardTodo = ({ cardData, setCardData }: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (!cardData) return;
    setTodos(cardData?.todos || []);
  }, [cardData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!cardData) return;

      const formData = new FormData(e.target as HTMLFormElement);
      const todo = formData.get('todo') as string;
      if (!todo.trim()) {
        toast.error('Todo content cannot be empty');
        return;
      }

      try {
        const newTodo = {
          id: crypto.randomUUID(),
          content: todo,
          completed: false,
        };
        setTodos(prevTodos => [...prevTodos, newTodo]);
        const updatedCard = {
          ...cardData,
          todos: [...todos, newTodo],
        };
        const res = await addCardTodo({
          card: updatedCard,
        });
        formRef.current?.reset();
        if (res?.success) {
          setCardData(res.result);
          toast.success('Your todo added to card');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to add todo');
      }
    },
    [cardData, todos],
  );

  const handleCompleted = useCallback(
    async (id: string) => {
      if (!cardData) return;

      try {
        const todo = cardData.todos?.find(todo => todo.id === id);
        if (todo) {
          todo.completed = !todo.completed;
        }
        const res = await changeTodoCompleted({
          card: cardData,
        });
        if (res?.success) {
          setCardData(res.result);
          setTodos(res.result.todos);
          toast.success('Todo status updated');
        } else {
          toast.error(res?.error || 'Failed to update todo status');
        }
      } catch (error) {
        console.error('Error updating todo status:', error);
        toast.error('Failed to update todo status');
      }
    },
    [cardData],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      if (!cardData) return;

      try {
        if (confirm('Are you sure you want to delete this todo?')) {
          const updatedCard = {
            ...cardData,
            todos: todos.filter(todo => todo.id !== id),
          };
          const res = await removeCardTodo({
            card: updatedCard,
          });
          if (res?.success) {
            setCardData(res.result);
            setTodos(res.result.todos);
            toast.success('Todo deleted');
          } else {
            toast.error(res?.error || 'Failed to delete todo');
          }
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error('Failed to delete todo');
      }
    },
    [cardData, todos],
  );

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle
          title="Todos"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          length={todos.length}
        />
        <div
          className={`no-scrollbar max-h-[40vh] overflow-auto ${isOpen ? 'block' : 'hidden'}`}
        >
          <div className="my-2">
            {todos.length > 0 &&
              todos.map((todo: Todo, index: number) => (
                <div
                  key={index}
                  className="mb-2 flex flex-col items-start gap-2 rounded-md bg-input p-2"
                >
                  <div className="flex w-full justify-between gap-4">
                    <div className="flex flex-1 gap-2">
                      <input
                        type="checkbox"
                        name="completed"
                        id="completed"
                        checked={todo.completed}
                        onChange={() => handleCompleted(todo.id)}
                      />
                      <p className="bg-input p-2 text-xs">{todo.content}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(todo.id)}
                      className="text-red-500"
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                </div>
              ))}
            {!todos && (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-6 w-[250px]" />
              </div>
            )}
          </div>
          {isEditable ? (
            <form onSubmit={handleSubmit} className="space-y-2" ref={formRef}>
              <TextAreaForm
                id="todo"
                className="mt-2 w-full"
                placeholder="Write a todo to card"
                defaultValue={''}
              />
              <div className="flex items-center justify-between">
                <FormSubmit>Add</FormSubmit>
                <Button
                  type="button"
                  onClick={() => setIsEditable(false)}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div
              role="button"
              className="rounded-ms min-h-20 bg-slate-100 p-3 text-sm"
              onClick={() => setIsEditable(true)}
            >
              {'Write a todo to card'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTodo;
