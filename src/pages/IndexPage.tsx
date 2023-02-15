import { useLocation } from "wouter";

export default function IndexPage() {
  const [_, setLocation] = useLocation();

  setLocation("/graph", {
    replace: true,
  });

  return <div>Index Page</div>;
}
