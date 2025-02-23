"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";

type HeaderProps = {
  user: User | null;
};

// ヘッダー
const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますか？")) {
      return;
    }

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b">
      <div className="max-w-2xl mx-auto px-2 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Todo App
        </Link>

        <div className="text-sm font-bold">
          {user ? (
            <div className="flex items-center space-x-5">
              <Link href="/todo/new">todo追加</Link>

              <div className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/login">ログイン</Link>
              <Link href="/signup">サインアップ</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
