import Baner from "../components/Baner/Baner";
import CategoryNav from "../components/CategoryNav/CategoryNav";
import Productos from "./Productos";

export default function Home() {
  return (
    <div>
      <Baner />
      <CategoryNav />
      <Productos numberOfProducts={7} />
    </div>
  );
}
