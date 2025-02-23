"use client";

import { changeCompleted, deleteTodo } from "@/actions/todo";
import { TodoType } from "@/types";
import {
  FilePenLine,
  Loader2,
  Square,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type TodoItemProps = {
  todo: TodoType & {
    profiles: {
      name: string;
    };
  };
};

const TodoItem = ({ todo }: TodoItemProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCompleted = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await changeCompleted({
          todoId: todo.id,
          completed: !todo.completed,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        router.refresh();
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました");
      }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const res = await deleteTodo(todo.id);

        if (res?.error) {
          setError(res.error);
          return;
        }

        toast.success("todoを削除しました");
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました");
      }
    });
  };

  return (
    <Link
      href={`todo/${todo.id}`}
      className="flex w-full items-center space-x-4 p-2 border-b hover:bg-gray-50 transition"
    >
      {todo.completed ? (
        <SquareCheckBig onClick={handleCompleted} />
      ) : (
        <Square onClick={handleCompleted} />
      )}
      <div className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
        <div className="font-bold">{todo.title}</div>
        <div className="text-sm text-gray-600">{todo.content}</div>
      </div>

      <button
        className="cursor-pointer"
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin text-red-700" />
        ) : (
          <Trash2 className="w-6 h-6 text-red-700" />
        )}
      </button>
    </Link>
  );
};

export default TodoItem;
