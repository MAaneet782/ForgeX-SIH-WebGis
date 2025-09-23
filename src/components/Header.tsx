import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="p-4 border-b flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome</h1>
      <div>
        <Button variant="outline">Login</Button>
      </div>
    </header>
  );
};

export default Header;