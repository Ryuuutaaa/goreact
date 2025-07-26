import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");
  const [message, setMessage] = useState("");

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      setMessage("Todo tidak boleh kosong!");
    }

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


      if (!res.ok) throw new Error("gagal menambahkan todo");

      setMessage("Berhasil menambahkan todo");
      setNewTodo("");
    } catch (err) {
      setMessage((err as Error).message);
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
          <Button type="submit">
            <IoMdAdd size={20} />
          </Button>
        </Flex>
      </form>
      {message && <Text>{message}</Text>}
    </>
  );
};

export default TodoForm;
