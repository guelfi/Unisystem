using MediatR;
using Unisystem.Application.Common;
using Unisystem.Application.DTOs;

namespace Unisystem.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<Result<LoginResponseDto>>;
