using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Dtos;
using API.Services.Ocr;
using API.StatProcessing;
using API.StatProcessing.WhutheringWaves;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;

namespace API.Tests.Services.Ocr
{
    public class OcrResultProcessorTests
    {
        private readonly IOcrResultProcessor _processor;

        public OcrResultProcessorTests()
        {
            var services = new ServiceCollection();

            // Register
            services.AddScoped<IGameStatResolver, WhutheringWavesStatResolver>();
            services.AddScoped<WhutheringWavesStatResolver>();
            services.AddScoped<IGameStatResolverFactory, GameStatResolverFactory>();
            services.AddScoped<IOcrResultProcessor, OcrResultProcessor>();

            var serviceProvider = services.BuildServiceProvider();

            // Get instance for tests
            _processor = serviceProvider.GetRequiredService<IOcrResultProcessor>();
        }

        [Fact]
        public void Process_ShouldReturnValidDto_ForRecognizedSubstat()
        {
            // Arrange
            var lines = new List<string> { "CRIT. RATE 7.5%" };

            // Act
            var result = _processor.Process(lines, GameType.WhutheringWaves);

            // Assert
            result.Should().HaveCount(1);

            var stat = result.Single();
            stat.Stat.Should().Be("CRIT. RATE");
            stat.RawValue.Should().Be("7.5%");
            stat.Value.Should().Be(7.5m);
            stat.IsPercentage.Should().BeTrue();
            stat.StatType.Should().Be(OcrStatType.SubStat.ToString());
        }

        [Fact]
        public void Process_ShouldNormalizeValue_WhenInputScaling()
        {
            // Arrange
            var lines = new List<string> { "DEF 600" };

            // Act
            var result = _processor.Process(lines, GameType.WhutheringWaves);

            // Assert
            var stat = result.First();
            stat.Stat.Should().Be("DEF");
            stat.RawValue.Should().Be("600");
            stat.Value.Should().Be(60m);
            stat.StatType.Should().Be(OcrStatType.SubStat.ToString());
        }

        [Fact]
        public void Process_ShouldReturnUnknown_WhenStatNotRecognized()
        {
            // Arrange
            var lines = new List<string> { "MAGIC RESIST 50%" };

            // Act
            var result = _processor.Process(lines, GameType.WhutheringWaves);

            // Assert
            var stat = result.First();
            stat.StatType.Should().Be(OcrStatType.MainStat.ToString());
        }

        [Fact]
        public void Process_ShouldHandleEmptyRawValue()
        {
            // Arrange
            var lines = new List<string> { "ATK%" };

            // Act
            var result = _processor.Process(lines, GameType.WhutheringWaves);

            // Assert
            var stat = result.First();
            stat.RawValue.Should().BeEmpty();
            stat.Value.Should().Be(0m);
            stat.IsPercentage.Should().BeFalse();
        }

        [Fact]
        public void Process_ShouldHandleCostStat_WhenInputIsCost()
        {
            // Arrange
            var lines = new List<string> { "Cost 4" };

            // Act
            var result = _processor.Process(lines, GameType.WhutheringWaves);

            // Assert
            var stat = result.First();
            stat.StatType.Should().Be("Cost");
            stat.RawValue.Should().Be("4");
            stat.Value.Should().Be(4);
            stat.IsPercentage.Should().BeFalse();
        }
    }
}
