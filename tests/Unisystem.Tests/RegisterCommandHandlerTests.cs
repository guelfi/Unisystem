using Moq;
using Unisystem.Application.Features.Auth.Commands.Register;
using Unisystem.Domain.Entities;
using Unisystem.Domain.Interfaces;
using Xunit;
using FluentAssertions;

namespace Unisystem.Tests;

public class RegisterCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenEmailAlreadyExists()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        var mockUnitOfWork = new Mock<IUnitOfWork>();
        
        mockRepo.Setup(r => r.EmailExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(true);

        var handler = new RegisterCommandHandler(mockRepo.Object, mockUnitOfWork.Object);
        var command = new RegisterCommand("Test User", "test@example.com", "password123");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("E-mail já cadastrado");
    }

    [Fact]
    public async Task Handle_ShouldReturnSuccess_WhenEmailDoesNotExist()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        var mockUnitOfWork = new Mock<IUnitOfWork>();
        
        mockRepo.Setup(r => r.EmailExistsAsync(It.IsAny<string>()))
            .ReturnsAsync(false);
        mockUnitOfWork.Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var handler = new RegisterCommandHandler(mockRepo.Object, mockUnitOfWork.Object);
        var command = new RegisterCommand("Test User", "test@example.com", "password123");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        mockRepo.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
        mockUnitOfWork.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
