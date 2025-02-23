import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoNew from "@/components/todo/TodoNew";

const TodoNewPage = async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    redirect("/");
  }

  return (
    <Suspense fallback={<Loading />}>
      <TodoNew userId={user.id} />
    </Suspense>
  );
};

export default TodoNewPage;
