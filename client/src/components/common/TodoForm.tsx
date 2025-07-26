import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const TodoForm = () => {
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
    setMessage("")

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newTodo,
            completed: false,
          }),
        });


      if (!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }


      setMessage("Berhasil menambahkan todo");
      setNewTodo("");
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
