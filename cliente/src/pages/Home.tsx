import Baner from "../components/Baner/Baner";
import Productos from "./Productos";

export default function Home() {
  return (
    <div>
      <Baner />
      <Productos numberOfProducts={7} />
    </div>
  );
}
