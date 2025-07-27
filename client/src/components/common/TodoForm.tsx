import { 
  Button, Flex, Input, Box, Text 
} from "@chakra-ui/react";
import { useState } from "react";
import { BiPlusCircle } from "react-icons/bi";

interface Todo {
  id: string;
  body: string;
  completed: boolean;
}

interface TodoFormProps {
  onTodoCreated: (newTodo: Todo) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoCreated }) => {
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      setMessage("Todo cannot be empty");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: newTodo,
          completed: false,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to add todo";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (err) {
          errorMessage = `HTTP ${res.status} : ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const createdTodo = await res.json();
      setNewTodo("");
      onTodoCreated(createdTodo);
      setMessage("Todo added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error creating todo:", err);
      setMessage(`Error: ${(err as Error).message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mb={8}>
      <form onSubmit={createTodo}>
        <Flex gap={3}>
          <Input
            size="lg"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            variant="flushed"
            focusRing="blue.500"
          />
          <Button
            type="submit"
            colorScheme="blue"
            loading={isLoading}
            loadingText="Adding..."
            size="lg"
            px={6}
            // leftIcon={<span>+</span>}
          >
            < BiPlusCircle />
          </Button>
        </Flex>
      </form>

      {message && (
        <Text 
          mt={2}
          color={
            message === "Todo cannot be empty"
              ? "orange.400"
              : message.startsWith("Error")
              ? "red.500"
              : "green.500"
          }
          fontSize="sm"
          textAlign="center"
        >
          {message}
        </Text>
      )}
    </Box>
  );
};

export default TodoForm;