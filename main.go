package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

type Todo struct {
	ID        int    `json:"id"`
	Completed bool   `json:"completed"`
	Body      string `json:"body"`
}

func main() {
	fmt.Print("Hello world")
	app := fiber.New()

	todos := []Todo{}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{"msg": "hellow world"})

	})


	// create a todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Todo body is requreid"})
		}

		todo.ID = len(todos) + 1
		todos = append(todos, *todo)

		var x int = 5
		var p *int = &x

		fmt.Println(p)
		fmt.Println(*p)

		return c.Status(201).JSON(todo)
	})

	// update a todo
	app.Patch("/api/todo/:id", func (c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id 
				toods[i].Completed = true 
				return c.Status(200).JSON(todos[i])
		}

		
	})

	log.Fatal(app.Listen(":4000"))

}
