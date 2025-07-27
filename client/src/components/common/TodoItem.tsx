import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";

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
      setMessage("Todo sudah selesai");
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
       let errorMessage = "Gagal mengupdate tood"
	   try{
			const errorData = await res.json();
			errorMessage = errorData.error || errorMessage;
	   }catch (err) {
		errorMessage = `HTTP ${res.status} : ${res.statusText}`

	   }
      }

      onTodoUpdate(todo.id);
      setMessage("Todo berhasil diselesaikan!");
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
       let errorMessage = "Gagal menghapus tood"
	   try{
			const errorData = await res.json();
			errorMessage = errorData.error || errorMessage;
	   }catch (err) {
		errorMessage = `HTTP ${res.status} : ${res.statusText}`

	   }
      }

      onTodoDelete(todo.id);
      setMessage("Todo berhasil dihapus!");
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
      borderColor="gray.200"
      borderRadius="md"
      bg={todo.completed ? "green.50" : "white"}
      shadow="sm"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center">
        <Text
          fontSize="md"
          textDecoration={todo.completed ? "line-through" : "none"}
          color={todo.completed ? "gray.500" : "gray.800"}
          opacity={todo.completed ? 0.6 : 1}
          flex="1"
          mr={4}
        >
          {todo.body}
        </Text>
        
        <Flex gap={2}>
          <Button
            size="sm"
            colorScheme={todo.completed ? "gray" : "green"}
            variant={todo.completed ? "ghost" : "solid"}
            onClick={handleToggleComplete}
            loading={isUpdating}
            disabled={isUpdating || isDeleting}
          >
            {todo.completed ? "Selesai" : "Tandai"}
          </Button>
          
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isUpdating || isDeleting}
          >
            Hapus
          </Button>
        </Flex>
      </Flex>

      {message && (
        <Box mt={3} pt={3} borderTop="1px" borderColor="gray.100">
          <Text 
            fontSize="sm" 
            color={message.includes("Error") ? "red.500" : "green.500"}
            fontWeight="medium"
          >
            {message}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default TodoItem;