import { Container, Stack,  } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./components/common/Navbar";
import TodoForm from "./components/common/TodoForm";
import TodoList from "./components/common/TodoList";
import { useColorModeValue } from "./components/ui/color-mode";

interface Todo {
  id: string;
  body: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const bgColor = useColorModeValue("gray.50", "gray.800");

  const handleTodoCreated = (newTodo: Todo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos]); 
  };

  return (
    <Stack minH="100vh" bg={bgColor}>
      <Navbar />
      <Container maxW="container.md" py={8}>
       <TodoForm onTodoCreated={handleTodoCreated} />
        <TodoList todos={todos} setTodos={setTodos} />
      </Container>
    </Stack>
  );
}

export default App;