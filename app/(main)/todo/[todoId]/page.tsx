import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoDetail from "@/components/todo/TodoDetail";

type TodoDetailPageProps = {
  params: {
    todoId: string;
  };
};

const TodoDetailPage = async ({ params }: TodoDetailPageProps) => {
  const { todoId } = params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // Todo詳細取得
  const { data: todo } = await supabase
    .from("todos")
    .select(
      `
      *,
      user_id,
      profiles (
        name
      )
    `
    )
    .eq("id", todoId)
    .single();

  if (!todo) {
    return <div className="text-center">Todoが存在しません</div>;
  }

  // ログインユーザーがTodo作成者かどうか
  const isMyTodo = user?.id === todo.user_id;

  return (
    <Suspense fallback={<Loading />}>
      <TodoDetail todo={todo} isMyTodo={isMyTodo} />
    </Suspense>
  );
};

export default TodoDetailPage;
