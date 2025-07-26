import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/common/Navbar";
import TodoForm from "./components/common/TodoForm";
import TodoList from "./components/common/TodoList";

function App() {
  return (
    <>
      <Stack h="100vh">
        <Navbar />
        <Container>
          <TodoForm />
          <TodoList />
        </Container>
      </Stack>
    </>
  );
}

export default App;
