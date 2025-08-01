using System.Security.Cryptography;
using API.Dtos;
using API.Models;
using API.Repositories;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace API.Services.Images
{
    public class ImageService : IImageService
    {
        private readonly string _rootImageFolder;
        private readonly int _thumbnailWidth = 300;
        private readonly IImageRepository _imageRepository;

        public ImageService(IWebHostEnvironment env, IImageRepository imageRepository)
        {
            _rootImageFolder = Path.Combine(env.ContentRootPath, "Storage", "Images");
            _imageRepository = imageRepository;
        }

        public async Task<ImageUploadDto> SaveSplashArtAsync(IFormFile file, string folderName, string fileName)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            var safeFolderName = SanitizeFileName(folderName);
            var safeFileName = SanitizeFileName(fileName);

            // Hashing
            var hash = ComputateHash(file);

            // Name changing
            var extension = Path.GetExtension(file.FileName);
            var fileBaseName = $"{safeFileName}-{hash}";
            var fileFullName = $"{fileBaseName}{extension}";
            var thumbFileName = $"{fileBaseName}_thumb{extension}";

            var fileDir = Path.Combine(_rootImageFolder, safeFolderName);
            Directory.CreateDirectory(fileDir);

            // Full path
            var fullPath = Path.Combine(fileDir, fileFullName);
            var thumbPath = Path.Combine(fileDir, thumbFileName);

            // Save og
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save thumb
            using (var image = await SixLabors.ImageSharp.Image.LoadAsync(fullPath))
            {
                var ratio = (double)_thumbnailWidth / image.Width;
                var newHeight = (int)(image.Height * ratio);

                image.Mutate(x => x.Resize(_thumbnailWidth, newHeight));
                await image.SaveAsync(thumbPath);
            }

            // Save to database
            var splashArtUrl = $"/images/{safeFolderName}/{fileName}";
            var thumbUrl = $"/images/{safeFolderName}/{thumbPath}";

            var imageModel = new API.Models.Image
            {
                SplashArtPath = splashArtUrl,
                ThumbnailPath = thumbUrl,
                Hash = hash,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };

            return new();
        }

        private static string SanitizeFileName(string input)
        {
            foreach (char c in Path.GetInvalidFileNameChars())
            {
                input = input.Replace(c, '-');
            }
            return input.Replace(" ", "");
        }

        private static string ComputateHash(IFormFile file)
        {
            using var sha256 = SHA256.Create();
            using var stream = file.OpenReadStream();
            var hashBytes = sha256.ComputeHash(stream);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }
    }
}
