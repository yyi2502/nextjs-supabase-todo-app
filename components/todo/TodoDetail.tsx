"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FilePenLine,
  Loader2,
  Square,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import FormError from "@/components/auth/FormError";
import Link from "next/link";
import toast from "react-hot-toast";
import { TodoType } from "@/types";
import { changeCompleted, deleteTodo } from "@/actions/todo";

type TodoDetailProps = {
  todo: TodoType & {
    profiles: {
      name: string;
    };
  };
};

const TodoDetail = ({ todo }: TodoDetailProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCompleted = async (
    e: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    setError("");

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
    <>
      <div className="flex w-full items-center gap-4">
        {todo.completed ? (
          <SquareCheckBig
            onClick={handleCompleted}
            className="cursor-pointer"
          />
        ) : (
          <Square onClick={handleCompleted} className="cursor-pointer" />
        )}
        <div className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
          <div className="font-bold text-2xl">{todo.title}</div>
          {todo.content && (
            <div className="leading-relaxed break-words whitespace-pre-wrap mt-4">
              {todo.content}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500 text-right">
        作成者：{todo.profiles.name}
      </div>

      <div className="flex items-center justify-end space-x-3 mt-3">
        <Link href={`/todo/${todo.id}/edit`}>
          <FilePenLine className="w-6 h-6" />
        </Link>
        <button
          className="cursor-pointer"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin text-red-500" />
          ) : (
            <Trash2 className="w-6 h-6 text-red-500" />
          )}
        </button>
      </div>

      <FormError message={error} />
    </>
  );
};

export default TodoDetail;
