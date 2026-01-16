# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["Unisystem.API/Unisystem.API.csproj", "Unisystem.API/"]
COPY ["Unisystem.Application/Unisystem.Application.csproj", "Unisystem.Application/"]
COPY ["Unisystem.Domain/Unisystem.Domain.csproj", "Unisystem.Domain/"]
COPY ["Unisystem.Infrastructure/Unisystem.Infrastructure.csproj", "Unisystem.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Unisystem.API/Unisystem.API.csproj"

# Copy source code
COPY . .

# Build
WORKDIR "/src/Unisystem.API"
RUN dotnet build "Unisystem.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Unisystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5050

# Copy published files
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5050
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Unisystem.API.dll"]
