namespace todolist.Models;

public class User
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public List<TodoItem> Todos { get; set; } = new List<TodoItem>();
}