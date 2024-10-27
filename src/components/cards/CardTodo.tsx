
"use client";
import { useEffect, useRef } from "react";
import { addCardTodo, changeTodoCompleted, removeCardTodo } from "@/app/actions/card";
import React, { useState } from "react";
import { toast } from "sonner";
import TextAreaForm from "../atomic/TextAreaForm";
import FormSubmit from "../atomic/FormSubmit";
import { Button } from "../ui/button";
import { Card, Todo } from '@/types';
import { Skeleton } from "../ui/skeleton";
import { FaRegTrashCan } from "react-icons/fa6";
import SubTitle from "./SubTitle";


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
    setTodos(cardData.todos);
  }, [cardData]);

  const handleSubmit = async (data: FormData) => {
    const todo = data.get("todo") as string;
    if (!todo.trim()) {
      toast.error('Todo content cannot be empty')
      return
    }
    try {
      const newTodo = {
        id: crypto.randomUUID(),
        content: todo,
        completed: false,
      }
      setTodos([...todos, newTodo]);
      const updatedCard = {
        ...cardData,
        todos: [...todos, newTodo],
      }
      const res = await addCardTodo({
        card: updatedCard,
      });
      formRef.current?.reset();
      if (res?.success) {
        setCardData(res.result);
        toast.success("Your todo added to card");
      }
    } catch (error) {
      toast.error("Fail to add todo");
    }
  };

  const handleCompleted = async (id: string) => {
    try {
      const todo = cardData.todos?.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed
      }
      const res = await changeTodoCompleted({
        card: cardData,
      })
      if (res?.success) {
        console.log(res.result)
        setCardData(res.result)
        setTodos(res.result.todos)
        toast.success('Todo status updated')
      } else {
        toast.error(res?.error || 'Failed to update todo status')
      }
    } catch (error) {
      console.error('Error updating todo status:', error)
      toast.error('Failed to update todo status')
    }
  }

  const handleRemove = async (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this todo?')) {
        const updatedCard = {
          ...cardData,
          todos: todos.filter((todo) => todo.id !== id),
        }
        const res = await removeCardTodo({
          card: updatedCard
        })
        if (res?.success) {
          setCardData(res.result)
          setTodos(res.result.todos)
          toast.success('Todo deleted')
        } else {
          toast.error(res?.error || 'Failed to delete todo')
        }
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast.error('Failed to delete todo')
    }
  }

  return (
    <div className="mb-[1rem]">
      <div>
        <SubTitle title="Todos" isOpen={isOpen} setIsOpen={setIsOpen} length={todos.length} />
        <div
          className={`max-h-[40vh] overflow-auto no-scrollbar ${isOpen ? "block" : "hidden"
            }`}
        >
          <div className="my-2">
            {todos ? (todos?.map((todo: Todo, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-2 mb-2 bg-input rounded-md items-start p-2"
              >
                <div className="flex justify-between gap-4 w-full">
                  <div className="flex gap-2 flex-1">
                    <input type="checkbox" name="completed" id="completed" checked={todo.completed} onChange={() => handleCompleted(todo.id)} />
                    <p className="bg-input p-2 text-xs">{todo.content}</p>
                  </div>
                  <button onClick={() => handleRemove(todo.id)} className="text-red-500"><FaRegTrashCan /></button>
                </div>
              </div>
            ))) : (<div className="flex flex-col space-y-3">

              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-6 w-[250px]" />
            </div>)}
          </div>
          {isEditable ? (
            <form action={handleSubmit} className="space-y-2" ref={formRef}>
              <TextAreaForm
                id="todo"
                className="w-full mt-2"
                placeholder="Write a comment to card"
                defaultValue={""}
              />
              <div className="flex justify-between items-center">
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
              className="min-h-20 bg-slate-100 text-sm p-3 rounded-ms"
              onClick={() => setIsEditable(true)}
            >
              {"Write a todo to card"}
            </div>
          )}
        </div>
      </div>
    </div >
  )
}

export default CardTodo

