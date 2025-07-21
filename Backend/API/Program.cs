using API.Config;
using API.Data;
using API.Mappings;
using API.Models;
using API.Repositories;
using API.Services.Cache;
using API.Services.Files;
using API.Services.Ocr;
using API.StatProcessing;
using API.StatProcessing.WhutheringWaves;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

string? ocrUrl = builder.Configuration["OCR_URL"];
string? corsOrigins = builder.Configuration["CORS_ORIGINS"];

builder.Services.AddSingleton(new GlobalConfig
{
    OCRUrl = ocrUrl,
    CorsOrigins = corsOrigins
});

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
                corsOrigins ?? "http://localhost:3000", 
                "http://127.0.0.1:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Automapper
builder.Services.AddAutoMapper(typeof(GameStatProfile));

// Add custom services
// Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IGameStatRepository, GameStatRepository>();
builder.Services.AddScoped<IGameArtifactNameRepository, GameArtifactNameRepository>();

// Processors
builder.Services.AddScoped<IOcrResultProcessor, OcrResultProcessor>();
builder.Services.AddScoped<IFIleProcessingService, FileProcessingService>();

// Stats services
builder.Services.AddScoped<IGameStatResolver, WhutheringWavesStatResolver>();
builder.Services.AddScoped<WhutheringWavesStatResolver>();

// Other services
builder.Services.AddSingleton<ICachedDataService, CachedDataService>();

// Factory
builder.Services.AddScoped<IGameStatResolverFactory, GameStatResolverFactory>();

// Add PostgreSQL support
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Redis Cache support
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
    options.InstanceName = "RedisInstance";
});

// Add logging (implicitly configured via WebApplication.CreateBuilder)
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Swagger middleware
app.UseSwagger(
    
);
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "OCR API V1");
});

// Add auto migration
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    try
    {
        // Create Triggers
        var path = Path.Combine(AppContext.BaseDirectory, "Resources", "Triggers", "DatabaseTrigger.sql");
        var sql = File.ReadAllText(path);

        db.Database.ExecuteSqlRaw(sql);
    }
    catch(Exception ex)
    {
        Console.WriteLine(ex);
    }
}

// Seed data
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
        await DbSeeder.SeedAsync(scope.ServiceProvider, env);
    }
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