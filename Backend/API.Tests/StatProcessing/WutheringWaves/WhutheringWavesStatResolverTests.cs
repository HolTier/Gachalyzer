using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Dtos;
using API.StatProcessing.WhutheringWaves;
using FluentAssertions;

namespace API.Tests.StatProcessing.WutheringWaves
{
    public class WhutheringWavesStatResolverTests
    {
        [Fact]
        public void DetermineStatType_ShouldReturnSubStat_WhenValidValue()
        {
            // Arrange
            var resolver = new WhutheringWavesStatResolver();

            // Act
            var result = resolver.DetermineStatType("CRIT. RATE%", 7.5m, true, out var normalized);

            // Assert
            result.Should().Be(OcrStatType.SubStat.ToString());
            normalized.Should().Be(7.5m);
        }
    }
}
