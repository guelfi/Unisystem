using MediatR;
using Unisystem.Application.Common;
using Unisystem.Application.DTOs;

namespace Unisystem.Application.Features.Users.Queries.GetUsers;

public record GetUsersQuery : IRequest<Result<List<UserDto>>>;
