using System.Security.Cryptography;
using API.Dtos;
using API.Models;
using API.Repositories;
using API.Services.Cache;
using AutoMapper;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace API.Services.Images
{
    public class ImageService : IImageService
    {
        private readonly string _rootImageFolder;
        private readonly int _thumbnailWidth = 300;
        private readonly IImageRepository _imageRepository;
        private readonly IMapper _mapper;
        private readonly ICachedDataService _cachedDataService;

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

        public ImageService(
            IWebHostEnvironment env, 
            IImageRepository imageRepository, 
            ICachedDataService cachedDataService,
            IMapper mapper
        )
        {
            _rootImageFolder = Path.Combine(env.ContentRootPath, "Storage", "Images");
            _imageRepository = imageRepository;
            _cachedDataService = cachedDataService;
            _mapper = mapper;
        }

        public async Task<ImageDto> SaveImageAsync(IFormFile file, string folderName, string fileName, List<string> fileTags)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            await using var stream = file.OpenReadStream();

            var hash = ComputateHash(stream);

            var existingImage = await FindExistingImageAsync(hash);
            if (existingImage != null)
                return _mapper.Map<ImageDto>(existingImage);

            if (existingImage != null)
            {
                return new ImageDto
                {
                    Id = existingImage.Id,
                    SplashArtPath = existingImage.SplashArtPath,
                    ThumbnailPath = existingImage.ThumbnailPath,
                };
            }

            var (fullPath, thumbPath, splashArtUrl, thumbUrl) 
                = PreparePaths(folderName, fileName, file.FileName, hash);

            stream.Position = 0;
            await GenerateThumbnailAsync(stream, thumbPath);

            stream.Position = 0;
            await SaveOriginalAsync(stream, fullPath);

            var image = await SaveToDatabaseAsync(splashArtUrl, thumbUrl, hash, fileTags);

            await ClearImageCacheAsync();

            return _mapper.Map<ImageDto>(image);
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
                    await SaveImageAsync(formFile, folderName, fileName, new List<string>() { "image", "scaned" });
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
            input = Path.GetFileName(input);

            foreach (char c in Path.GetInvalidFileNameChars())
            {
                input = input.Replace(c, '-');
            }

            return input.Replace(" ", "");
        }

        private static string ComputateHash(Stream stream)
        {
            stream.Position = 0;
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(stream);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();
        }

        private async Task<API.Models.Image?> FindExistingImageAsync(string hash)
        {
            return await _cachedDataService
                .GetOrSetCacheAsync($"image:{hash}", () => _imageRepository.GetByHashAsync(hash));
        }

        private async Task ClearImageCacheAsync()
        {
            await _cachedDataService.ClearCacheAsync("image:all");
            await _cachedDataService.ClearCacheAsync("image:all-tags");
        }

        private (string fullPath, string thumbPath, string splashArtUrl, string thumbUrl)
            PreparePaths(string folderName, string fileName, string originalFileName, string hash)
        {
            var safeFolder = SanitizeFileName(folderName);
            var safeFile = SanitizeFileName(fileName);
            var ext = Path.GetExtension(originalFileName);

            var fileBaseName = $"{safeFile}-{hash}";
            var fileFullName = $"{fileBaseName}{ext}";
            var thumbName = $"{fileBaseName}_thumb{ext}";

            var fileDir = Path.Combine(_rootImageFolder, safeFolder);
            Directory.CreateDirectory(fileDir);

            var fullPath = Path.Combine(fileDir, fileFullName);
            var thumbPath = Path.Combine(fileDir, thumbName);

            var splashArtUrl = $"/images/{safeFolder}/{fileFullName}";
            var thumbUrl = $"/images/{safeFolder}/{thumbName}";

            return (fullPath, thumbPath, splashArtUrl, thumbUrl);
        }

        private async Task GenerateThumbnailAsync(Stream stream, string thumbPath)
        {
            using var image = await SixLabors.ImageSharp.Image.LoadAsync(stream);
            var ratio = (double)_thumbnailWidth / image.Width;
            var newHeight = (int)(image.Height * ratio);

            image.Mutate(x => x.Resize(_thumbnailWidth, newHeight));
            await image.SaveAsync(thumbPath);
        }

        private async Task SaveOriginalAsync(Stream input, string fullPath)
        {
            await using var output = new FileStream(fullPath, FileMode.Create);
            await input.CopyToAsync(output);
        }

        private async Task<API.Models.Image> SaveToDatabaseAsync(string splashArtUrl, string thumbUrl, 
            string hash, List<string> tags)
        {
            var image = new API.Models.Image
            {
                SplashArtPath = splashArtUrl,
                ThumbnailPath = thumbUrl,
                Hash = hash,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow,
                ImageStatusId = (int)ImageStatus.Available,
                Tags = tags
            };

            await _imageRepository.AddAsync(image);
            return image;
        }
    }
}
