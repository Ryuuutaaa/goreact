import { Container, Stack } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./components/common/Navbar";
import TodoForm from "./components/common/TodoForm";
import TodoList from "./components/common/TodoList";

interface Todo {
  id: string;
  body: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleTodoCreated = (newTodo: Todo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  return (
    <>
      <Stack h="100vh">
        <Navbar />
        <Container>
          <TodoForm onTodoCreated={handleTodoCreated} />
          <TodoList todos={todos} setTodos={setTodos} />
        </Container>
      </Stack>
    </>
  );
}

export default App;