'use client';
import React from 'react';

import {
  addCardTodo,
  changeTodoCompleted,
  removeCardTodo,
} from '@/app/actions/card';
import { saveCard } from '@/lib/save-card';
import { Card, Todo } from '@/types';

import CardSection, { RemoveItemButton } from './card-section';
import { ExpandableTextForm } from './inline-text-form';

interface CardProps {
  cardData: Card;
  setCardData: (cardData: Card) => Promise<void>;
}

const CardTodo = ({ cardData, setCardData }: CardProps) => {
  const todos = cardData.todos ?? [];

  const saveTodos = (
    nextTodos: Todo[],
    action: typeof addCardTodo,
    successMessage: string,
    errorMessage: string,
  ) =>
    saveCard({
      previous: cardData,
      next: { ...cardData, todos: nextTodos },
      onCardUpdate: setCardData,
      action: card => action({ card }),
      successMessage,
      errorMessage,
    });

  const handleSubmit = (content: string) =>
    saveTodos(
      [...todos, { id: crypto.randomUUID(), content, completed: false }],
      addCardTodo,
      'Your todo added to card',
      'Failed to add todo',
    );

  const handleCompleted = (id: string | null) =>
    saveTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
      changeTodoCompleted,
      'Todo status updated',
      'Failed to update todo status',
    );

  const handleRemove = async (id: string | null) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    await saveTodos(
      todos.filter(todo => todo.id !== id),
      removeCardTodo,
      'Todo deleted',
      'Failed to delete todo',
    );
  };

  return (
    <CardSection
      title="Todos"
      count={todos.length}
      footer={
        <ExpandableTextForm
          name="todo"
          placeholder="Write a todo to card"
          submitLabel="Add"
          emptyMessage="Todo content cannot be empty"
          onSubmit={handleSubmit}
        />
      }
    >
      {todos.map((todo: Todo) => (
        <div
          key={todo.id}
          className="mb-2 flex flex-col items-start gap-2 rounded-md bg-input p-2"
        >
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-1 gap-2">
              <input
                type="checkbox"
                name="completed"
                aria-label={todo.content ?? ''}
                checked={!!todo.completed}
                onChange={() => handleCompleted(todo.id)}
              />
              <p className="bg-input p-2 text-xs">{todo.content}</p>
            </div>
            <RemoveItemButton onClick={() => handleRemove(todo.id)} />
          </div>
        </div>
      ))}
    </CardSection>
  );
};

export default CardTodo;
