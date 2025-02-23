import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoItem from "@/components/todo/TodoItem";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// メインページ
const MainPage = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return (
      <div className="text-center">
        <p>ログインして使用できるtodoアプリです。</p>

        <Button asChild className="w-full mt-5">
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    );
  }

  // todo一覧取得
  const { data: todos, error } = await supabase
    .from("todos")
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      )
    `
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  console.log(todos);
  if (todos?.length === 0 || error) {
    return <div className="text-center">TODOがありません</div>;
  }
  return (
    <Suspense fallback={<Loading />}>
      {todos.map((todo) => {
        return <TodoItem key={todo.id} todo={todo} />;
      })}
    </Suspense>
  );
};

export default MainPage;
