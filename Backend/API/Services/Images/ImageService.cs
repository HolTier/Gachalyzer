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

        public enum ImageStatus
        {
            Available = 1,
            Missing = 2,
            PendingUpload = 3,
            Corrupted = 4,
            Archived = 5,
            Deleted = 6,
            Error = 7,
            Processing = 8,
            External = 9
        }

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

            string hash;
            using (var stream = file.OpenReadStream())
            {
                hash = ComputateHash(stream);
            }

            var existingImage = await _imageRepository.GetByHashAsync(hash);

            if (existingImage != null)
            {
                return new ImageUploadDto
                {
                    SplashArtPath = existingImage.SplashArtPath,
                    ThumbnailPath = existingImage.ThumbnailPath,
                    Tags = new List<string>()
                };
            }

            var extension = Path.GetExtension(file.FileName);
            var fileBaseName = $"{safeFileName}-{hash}";
            var fileFullName = $"{fileBaseName}{extension}";
            var thumbFileName = $"{fileBaseName}_thumb{extension}";

            var fileDir = Path.Combine(_rootImageFolder, safeFolderName);
            Directory.CreateDirectory(fileDir);

            var fullPath = Path.Combine(fileDir, fileFullName);
            var thumbPath = Path.Combine(fileDir, thumbFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            using (var image = await SixLabors.ImageSharp.Image.LoadAsync(fullPath))
            {
                var ratio = (double)_thumbnailWidth / image.Width;
                var newHeight = (int)(image.Height * ratio);

                image.Mutate(x => x.Resize(_thumbnailWidth, newHeight));
                await image.SaveAsync(thumbPath);
            }

            var splashArtUrl = $"/images/{safeFolderName}/{fileFullName}";
            var thumbUrl = $"/images/{safeFolderName}/{thumbFileName}";

            var imageModel = new API.Models.Image
            {
                SplashArtPath = splashArtUrl,
                ThumbnailPath = thumbUrl,
                Hash = hash,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow,
                ImageStatusId = (int)ImageStatus.Available,
            };

            await _imageRepository.AddAsync(imageModel);

            return new ImageUploadDto
            {
                SplashArtPath = splashArtUrl,
                ThumbnailPath = thumbUrl,
                Tags = new List<string>()
            };
        }

        public async Task ScanAndCompareImagesAsync()
        {
            var imagesInDb = (await _imageRepository.GetAllAsync()).ToList();

            var imagesInFileSystem = Directory.GetFiles(_rootImageFolder, "*.*", SearchOption.AllDirectories)
                .Select(f => f.Replace(_rootImageFolder, "").Replace("\\", "/"))
                .ToList();

            foreach (var image in imagesInDb)
            {
                var splashArtPath = image.SplashArtPath.StartsWith("/images/")
                    ? image.SplashArtPath.Substring("/images".Length)
                    : image.SplashArtPath;

                var idx = imagesInFileSystem.FindIndex(f => f.EndsWith(splashArtPath, StringComparison.OrdinalIgnoreCase));
                if (idx == -1)
                {
                    if (image.ImageStatusId != (int)ImageStatus.Missing)
                    {
                        image.ImageStatusId = (int)ImageStatus.Missing;
                        image.LastModified = DateTime.UtcNow;
                        _imageRepository.Update(image);
                    }
                }
                else
                {
                    imagesInFileSystem.RemoveAt(idx);
                }
            }

            foreach (var filePath in imagesInFileSystem)
            { 
                var fullPath = Path.Combine(_rootImageFolder, filePath.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

                var relativePath = filePath.TrimStart('/');
                var folderName = Path.GetDirectoryName(relativePath)?.Replace("\\", "/") ?? "";
                var fileName = Path.GetFileNameWithoutExtension(relativePath);

                using var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);
                var formFile = new FormFile(stream, 0, stream.Length, fileName, Path.GetFileName(fullPath));

                try
                {
                    await SaveSplashArtAsync(formFile, folderName, fileName);
                }
                catch
                {
                    Console.WriteLine($"Error processing file: {fullPath}");
                    var imageModel = new API.Models.Image
                    {
                        SplashArtPath = $"/images/{folderName}/{Path.GetFileName(fullPath)}",
                        ThumbnailPath = null,
                        Hash = ComputateHash(stream),
                        CreatedAt = DateTime.UtcNow,
                        LastModified = DateTime.UtcNow,
                        ImageStatusId = (int)ImageStatus.Corrupted
                    };

                    await _imageRepository.AddAsync(imageModel);
                }
            }
        }

        private static string SanitizeFileName(string input)
        {
            foreach (char c in Path.GetInvalidFileNameChars())
            {
                input = input.Replace(c, '-');
            }
            return input.Replace(" ", "");
        }

        private static string ComputateHash(Stream stream)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(stream);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }
    }
}
