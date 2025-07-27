import { 
  Box, Button, Flex, Text, Badge 
} from "@chakra-ui/react";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { MdDoneAll } from "react-icons/md";

interface Todo {
  id: string;
  body: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onTodoUpdate: (id: string) => void;
  onTodoDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onTodoUpdate, onTodoDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleToggleComplete = async () => {
    if (todo.completed) {
      setMessage("Todo already completed");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsUpdating(true);
    setMessage("");
    
    try {
      const res = await fetch(`http://localhost:5000/api/todos/update/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        let errorMessage = "Failed to update todo";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (err) {
          errorMessage = `HTTP ${res.status} : ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      onTodoUpdate(todo.id);
      setMessage("Todo marked as completed!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating todo:", error);
      setMessage(`Error: ${(error as Error).message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");
    
    try {
      const res = await fetch(`http://localhost:5000/api/todos/delete/${todo.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete todo";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (err) {
          errorMessage = `HTTP ${res.status} : ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      onTodoDelete(todo.id);
      setMessage("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      setMessage(`Error: ${(error as Error).message}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box
      p={4}
      border="1px"
      borderColor={todo.completed ? "green.200" : "gray.200"}
      borderRadius="lg"
      bg={todo.completed ? "green.50" : "white"}
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
      position="relative"
    >
      {todo.completed && (
        <Badge 
          colorScheme="green" 
          position="absolute" 
          top={-2} 
          right={-2}
          borderRadius="full"
          px={2}
          boxShadow="sm"
        >
          Done
        </Badge>
      )}
      
      <Flex justify="space-between" align="center" gap={3}>
        <Text
          fontSize="lg"
          fontWeight={todo.completed ? "medium" : "semibold"}
          textDecoration={todo.completed ? "line-through" : "none"}
          color={todo.completed ? "gray.500" : "gray.700"}
          flex="1"
        >
          {todo.body}
        </Text>
        
        <Flex gap={2}>
          {!todo.completed && (
            <Button
              aria-label="Complete todo"
              colorScheme="green"
              variant="outline"
              onClick={handleToggleComplete}
              loading={isUpdating}
              disabled={isDeleting}
              size="sm"
              // leftIcon={<span>✓</span>}
            >
              < MdDoneAll />
            </Button>
          )}
          
          <Button
            aria-label="Delete todo"
            colorScheme="red"
            variant="ghost"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isUpdating}
            size="sm"
            // leftIcon={<span>×</span>}
          >
            <BiTrash />
          </Button>
        </Flex>
      </Flex>
      
      {!todo.completed && (
        <Flex mt={2} align="center">
          <Text fontSize="xs" color="orange.500" mr={1}>
            ⏳
          </Text>
          <Text fontSize="xs" color="orange.500">
            Pending
          </Text>
        </Flex>
      )}

      {message && (
        <Box 
          mt={2} 
          pt={2} 
          borderTop="1px dashed" 
          borderColor="gray.200"
          fontSize="sm"
          color={
            message === "Todo cannot be empty"
              ? "orange.500"
              : message.startsWith("Error")
          ? "red.500"
          : "green.500"
          }
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

export default TodoItem;