using API.Data;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger/OpenAPI with better configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "OCR API",
        Version = "v1",
        Description = "API for Optical Character Recognition"
    });
});

// Add health checks
builder.Services.AddHealthChecks();

// Add HttpClient support
builder.Services.AddHttpClient();

// For a named client
builder.Services.AddHttpClient("ocrClient", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecific",
        builder =>
        {
            builder.WithOrigins(
                 "http://localhost:3000",
                 "http://127.0.0.1:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add custom services
builder.Services.AddScoped<IOcrResultProcessor, OcrResultProcessor>();

// Add PostgreSQL support
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add logging (implicitly configured via WebApplication.CreateBuilder)
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "OCR API V1");
});

// Add auto migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // applies any pending migrations automatically
}

//app.UseHttpsRedirection();

// Use CORS (place before authorization)
app.UseCors("AllowSpecific");

app.UseAuthorization();

// Add global error handling
app.UseExceptionHandler("/error");

// Add health check endpoint
app.MapHealthChecks("/health");

app.MapControllers();

// Fallback error handling route
app.Map("/error", () => Results.Problem("An error occurred", statusCode: 500));

app.Run();