using Microsoft.AspNetCore.Mvc;
using todolist.Models;

namespace todolist.Controllers;

public class UserController : ControllerBase
{
    private static readonly List<User> Users = new();

    // POST /signup route
    [HttpPost("signup")]
    public IActionResult Signup([FromBody] User user)
    {
        // Check if the username is taken
        if (Users.Any(u => u.Username == user.Username))
            return BadRequest("User already exists");

        Users.Add(user);
        return Ok("Signup successful");
    }

    // POST /login route
    [HttpPost("login")]
    public IActionResult Login([FromBody] User user)
    {
        // Find matching username and password
        var u = Users.FirstOrDefault(u => u.Username == user.Username && u.Password == user.Password);
        if (u != null)
            return Ok("Welcome!");
        return Unauthorized("Username or password is invalid");
    }

    // Helper function
    public static User GetUser(string username, string password) =>
        Users.FirstOrDefault(u => u.Username == username && u.Password == password);
}
