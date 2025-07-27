import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

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
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)

const createTodo = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newTodo.trim()) {
    setMessage("Todo tidak boleh kosong!");
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
       let errorMessage = "Gagal menambahkan todo"
	   try{
			const errorData = await res.json();
			errorMessage = errorData.error || errorMessage;
	   }catch (err) {
		errorMessage = `HTTP ${res.status} : ${res.statusText}`

	   }
      }
    const createdTodo = await res.json();
    setMessage("Berhasil menambahkan todo");
    setNewTodo("");
    
      onTodoCreated(createdTodo);
      
      setTimeout(() => setMessage(""), 3000);
    
  } catch (err) {
    console.error("Error creating todo:", err);
    setMessage(`Error: ${(err as Error).message}`);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <>
      <form onSubmit={createTodo}>
        <Flex gap={12}>
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Tambahkan todo...."
          />
         <Button type="submit" loading={isLoading} disabled={isLoading}>
            <IoMdAdd size={20} />
          </Button>
        </Flex>
      </form>
     {message && (
        <Text 
          color={message.includes("Error") ? "red.500" : "green.500"}
          mt={2}
        >
          {message}
        </Text>
      )}
    </>
  );
};

export default TodoForm;
