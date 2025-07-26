import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/common/Navbar";
import TodoForm from "./components/common/TodoForm";

function App() {
  return (
    <>
      <Stack h="100vh">
        <Navbar />
        <Container>
          <TodoForm />
        </Container>
      </Stack>
    </>
  );
}

export default App;
