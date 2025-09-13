using Microsoft.AspNetCore.Mvc;
using todolist.Models;

namespace todolist.Controllers;

public class TodoController : ControllerBase
{
    private static int _todoCounter = 1;

    private User? GetUser() =>
        UserController.GetUser(Request.Headers["X-User"], Request.Headers["X-Pass"]);


    // GET / route
    [HttpGet("/todo")]
    public IActionResult GetTodos()
    {
        var user = GetUser();
        if (user == null) return Unauthorized();
        return Ok(user.Todos);
    }

    // POST / route
    [HttpPost("/todo")]
    public IActionResult AddTodo([FromBody] string task)
    {
        var user = GetUser();
        if (user == null) return Unauthorized();

        var todo = new TodoItem { itemId = _todoCounter++, Task = task };
        user.Todos.Add(todo);

        return Ok(todo);
    }

    // DELETE /{itemId} route
    [HttpDelete("{itemId}")]
    public IActionResult Delete(int itemId)
    {
        var user = GetUser();
        if (user == null) return Unauthorized();

        var todo = user.Todos.FirstOrDefault(t => t.itemId == itemId);
        if (todo == null) return NotFound();

        user.Todos.Remove(todo);
        return Ok();
    }

    // POST /{itemId}/toggle
    [HttpPost("{itemId}/toggle")]
    public IActionResult Toggle(int itemId)
    {
        var user = GetUser();
        if (user == null) return Unauthorized();

        var todo = user.Todos.FirstOrDefault(t => t.itemId == itemId);
        if (todo == null) return NotFound();

        todo.IsDone = !todo.IsDone;
        return Ok(todo);
    }
}
