using MediatR;
using Unisystem.Application.Common;

namespace Unisystem.Application.Features.Auth.Commands.Register;

public record RegisterCommand(string Name, string Email, string Password) : IRequest<Result>;
