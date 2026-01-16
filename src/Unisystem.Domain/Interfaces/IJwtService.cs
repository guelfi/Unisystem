namespace Unisystem.Domain.Interfaces;

public interface IJwtService
{
    string GenerateToken(Guid userId, string email, string name);
}
