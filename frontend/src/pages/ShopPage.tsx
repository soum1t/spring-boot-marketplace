import { useAuth } from "@/context/useAuth";

export default function ShopPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1>ShopPage</h1>
      <p>
        Welcome {user?.name}, {user?.email}
      </p>
    </div>
  );
}
