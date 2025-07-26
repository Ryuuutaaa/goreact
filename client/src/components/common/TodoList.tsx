import { Box, Flex, Spinner, Text, VStack, Badge, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

interface Todo {
  id: string;
  body: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTodos = async (showRefreshLoading = false) => {
    try {
      if (showRefreshLoading) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");
      
      const res = await fetch("http://localhost:5000/api/todos");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      
      const data = await res.json();
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError(`Failed to connect to server. Please make sure backend is running. Details: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos(false);
  }, []);

  const handleTodoUpdate = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const handleTodoDelete = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const refreshTodos = async () => {
    if (isRefreshing || isLoading) return;
    await fetchTodos(true);
  };

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  if (isLoading && !isRefreshing) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text mt={2} color="gray.600">
          Memuat todos...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500" fontSize="lg" mb={2}>
          Error memuat todos
        </Text>
        <Text color="gray.600" fontSize="sm">
          {error}
        </Text>
        <Button 
          mt={4} 
          colorScheme="blue" 
          size="sm"
          onClick={refreshTodos}
          loading={isRefreshing}
        >
          Coba Lagi
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {isRefreshing && (
        <Box textAlign="center" mb={4}>
          <Flex justify="center" align="center" gap={2}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color="blue.500">
              Memperbarui...
            </Text>
          </Flex>
        </Box>
      )}

      {totalTodos > 0 && (
        <Box mb={6}>
          <Flex justify="center" gap={4} mb={4}>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
              Total: {totalTodos}
            </Badge>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
              Selesai: {completedTodos}
            </Badge>
            <Badge colorScheme="orange" fontSize="sm" px={3} py={1} borderRadius="full">
              Pending: {pendingTodos}
            </Badge>
          </Flex>
        </Box>
      )}

      {totalTodos === 0 ? (
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="gray.500" mb={2}>
            Belum ada todo yang dibuat
          </Text>
          <Text fontSize="sm" color="gray.400">
            Tambahkan todo pertama Anda di atas!
          </Text>
        </Box>
      ) : (
        <VStack spaceX={4} align="stretch">
          {todos
            .filter(todo => !todo.completed)
            .map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onTodoUpdate={handleTodoUpdate}
                onTodoDelete={handleTodoDelete}
              />
            ))}
          
          {completedTodos > 0 && pendingTodos > 0 && (
            <Box py={2}>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                — Selesai —
              </Text>
            </Box>
          )}
          
          {todos
            .filter(todo => todo.completed)
            .map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onTodoUpdate={handleTodoUpdate}
                onTodoDelete={handleTodoDelete}
              />
            ))}
        </VStack>
      )}
    </Box>
  );
};

export default TodoList;