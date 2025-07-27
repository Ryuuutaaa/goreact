import { 
  Box, Flex, Spinner, Text, VStack, Badge, Button, 
  useDisclosure,
  Collapsible,   
} from "@chakra-ui/react";
import TodoItem from "./TodoItem";
import { useEffect, useState } from "react";

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
  const [message, setMessage] = useState("");
  const { open: showCompleted, onToggle: toggleCompleted } = useDisclosure({ defaultOpen: false });

  const fetchTodos = async (showRefreshLoading = false) => {
    try {
      if (showRefreshLoading) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError("");
      setMessage("");
      
      const res = await fetch("http://localhost:5000/api/todos");
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      
      const data = await res.json();
      setTodos(data || []);
      if (showRefreshLoading) {
        setMessage("Todos refreshed successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError(`Failed to connect to server. ${(error as Error).message}`);
      setMessage("");
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
      <Box textAlign="center" py={12}>
        <Spinner size="xl"  color="blue.500" />
        <Text mt={4} fontSize="lg" color="gray.600">
          Loading your todos...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={12} px={4}>
        <Text color="red.500" fontSize="xl" mb={3} fontWeight="semibold">
          Failed to load todos
        </Text>
        <Text color="gray.500" fontSize="md" mb={6}>
          {error}
        </Text>
        <Button 
          colorScheme="blue" 
          onClick={refreshTodos}
          loading={isRefreshing}
          size="lg"
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {message && (
        <Box 
          bg="green.100" 
          color="green.800" 
          p={3} 
          mb={4} 
          borderRadius="md"
          textAlign="center"
        >
          {message}
        </Box>
      )}

      <Flex justify="space-between" align="center" mb={6}>
        <Flex gap={3}>
          <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
            Total: {totalTodos}
          </Badge>
          <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
            Done: {completedTodos}
          </Badge>
          <Badge colorScheme="orange" fontSize="md" px={3} py={1} borderRadius="full">
            Pending: {pendingTodos}
          </Badge>
        </Flex>
        
        <Button
          onClick={refreshTodos}
          loading={isRefreshing}
          variant="ghost"
          size="sm"
          // leftIcon={<span>↻</span>}
        >
          Refresh
        </Button>
      </Flex>

      {isRefreshing && (
        <Box textAlign="center" mb={4}>
          <Flex justify="center" align="center" gap={2}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color="blue.500">
              Refreshing todos...
            </Text>
          </Flex>
        </Box>
      )}

      {totalTodos === 0 ? (
        <Box 
          textAlign="center" 
          py={12} 
          border="2px dashed" 
          borderColor="gray.200" 
          borderRadius="lg"
        >
          <Text fontSize="xl" color="gray.500" mb={2} fontWeight="medium">
            No todos yet
          </Text>
          <Text fontSize="md" color="gray.400">
            Add your first todo above!
          </Text>
        </Box>
      ) : (
        <VStack spaceX={3} align="stretch">
          {/* Pending Todos */}
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
          
          {/* Completed Todos Section */}
          {completedTodos > 0 && (
            <>
              <Flex 
                align="center" 
                mt={6} 
                mb={3} 
                cursor="pointer"
                onClick={toggleCompleted}
              >
                <Text fontSize="md" fontWeight="semibold" mr={2}>
                  Completed ({completedTodos})
                </Text>
                {showCompleted ? <span>▲</span> : <span>▼</span>}
              </Flex>
              
                {showCompleted && (
                <VStack spaceX={3} align="stretch" mt={2}>
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
            </>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default TodoList;